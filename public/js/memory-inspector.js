/**
 * SyntaxArena Visual Memory & Pointer Inspector (Batch 11)
 * Interactive Stack & Heap Memory Model Visualization with live pointer references,
 * hexadecimal addresses, type sizes, and dynamic hover linking.
 * 100% Client-Side with zero external libraries.
 */

import { Utils } from './utils.js';

export const MemoryInspector = {
  /**
   * Parse code and language to generate structured memory frame and heap model.
   * @param {string} code
   * @param {string} language
   * @returns {object} Memory model
   */
  generateMemoryModel(code = '', language = 'python') {
    const lang = (language || 'python').toLowerCase();
    const stackVariables = [];
    const heapBlocks = [];

    let stackBaseAddr = 0x7ffeefbff560;
    let heapBaseAddr = 0x55a80120;

    const lines = (code || '').split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('//') && !l.startsWith('#') && !l.startsWith('/*'));

    // Language specific heuristic extraction
    if (lang === 'c' || lang === 'cpp') {
      let heapCounter = 1;
      lines.forEach((line) => {
        // Pointer with malloc / new: int* p = malloc(...)
        const mallocMatch = line.match(/(?:int|char|float|double|void|\w+)\s*\*\s*(\w+)\s*=\s*(?:\([^)]+\))?\s*(?:malloc|calloc|new)\s*\(([^)]+)\)?/i);
        if (mallocMatch) {
          const varName = mallocMatch[1];
          const heapAddr = '0x' + (heapBaseAddr + heapCounter * 0x40).toString(16);
          const heapId = `heap-${heapCounter++}`;

          heapBlocks.push({
            id: heapId,
            label: `Dynamic Block (${varName})`,
            address: heapAddr,
            size: '16 bytes',
            type: 'Heap Buffer',
            data: ['0x00', '0x00', '0x00', '0x00'],
            referencedBy: [varName]
          });

          stackVariables.push({
            name: varName,
            type: 'pointer (8B)',
            address: '0x' + (stackBaseAddr -= 8).toString(16),
            value: heapAddr,
            isPointer: true,
            targetHeapId: heapId,
            desc: `Points to dynamic heap block at ${heapAddr}`
          });
          return;
        }

        // Pointer referencing variable: int* ptr = &val
        const refMatch = line.match(/(?:int|char|float|double|\w+)\s*\*\s*(\w+)\s*=\s*&(\w+)/);
        if (refMatch) {
          const ptrName = refMatch[1];
          const targetName = refMatch[2];
          const targetVar = stackVariables.find(v => v.name === targetName);
          const targetAddr = targetVar ? targetVar.address : '0x7ffeefbff540';

          stackVariables.push({
            name: ptrName,
            type: 'pointer (8B)',
            address: '0x' + (stackBaseAddr -= 8).toString(16),
            value: targetAddr,
            isPointer: true,
            targetVarName: targetName,
            desc: `Holds address &${targetName} (${targetAddr})`
          });
          return;
        }

        // Standard primitive: int count = 42;
        const primMatch = line.match(/(int|char|float|double|long|bool|size_t)\s+(\w+)\s*=\s*([^;]+);/);
        if (primMatch) {
          const pType = primMatch[1];
          const pName = primMatch[2];
          const pVal = primMatch[3].trim();
          const pSize = pType === 'char' || pType === 'bool' ? '1B' : (pType === 'double' || pType === 'long' ? '8B' : '4B');

          stackVariables.push({
            name: pName,
            type: `${pType} (${pSize})`,
            address: '0x' + (stackBaseAddr -= 4).toString(16),
            value: pVal,
            isPointer: false,
            desc: `Local stack primitive variable`
          });
        }
      });
    } else if (lang === 'python') {
      let objCounter = 1;
      const seenLists = new Map();

      lines.forEach((line) => {
        // List declaration: a = [1, 2, 3]
        const listMatch = line.match(/^(\w+)\s*=\s*\[([^\]]*)\]/);
        if (listMatch) {
          const varName = listMatch[1];
          const items = listMatch[2].split(',').map(s => s.trim()).filter(Boolean);
          const heapAddr = '0x7f88' + (heapBaseAddr + objCounter * 0x30).toString(16).slice(-4);
          const heapId = `py-obj-${objCounter++}`;

          seenLists.set(varName, { heapId, heapAddr, items });

          heapBlocks.push({
            id: heapId,
            label: `PyListObject ([${items.length} items])`,
            address: heapAddr,
            size: `${items.length * 8 + 48} bytes`,
            type: 'Python Mutable Object',
            data: items.length > 0 ? items : ['empty'],
            referencedBy: [varName]
          });

          stackVariables.push({
            name: varName,
            type: 'list reference (8B)',
            address: '0x' + (stackBaseAddr -= 8).toString(16),
            value: heapAddr,
            isPointer: true,
            targetHeapId: heapId,
            desc: `PyObject reference to PyListObject at ${heapAddr}`
          });
          return;
        }

        // Shared reference assignment: b = a
        const aliasMatch = line.match(/^(\w+)\s*=\s*(\w+)$/);
        if (aliasMatch) {
          const newVar = aliasMatch[1];
          const origVar = aliasMatch[2];

          if (seenLists.has(origVar)) {
            const listData = seenLists.get(origVar);
            const block = heapBlocks.find(b => b.id === listData.heapId);
            if (block && !block.referencedBy.includes(newVar)) {
              block.referencedBy.push(newVar);
            }

            stackVariables.push({
              name: newVar,
              type: 'shared ref (8B)',
              address: '0x' + (stackBaseAddr -= 8).toString(16),
              value: listData.heapAddr,
              isPointer: true,
              targetHeapId: listData.heapId,
              desc: `Shared pointer reference to same PyListObject as '${origVar}'`
            });
            return;
          }
        }

        // Primitive int / string assignment: x = 100 or s = "hello"
        const assignMatch = line.match(/^(\w+)\s*=\s*(.+)$/);
        if (assignMatch && !assignMatch[2].startsWith('[')) {
          const varName = assignMatch[1];
          const val = assignMatch[2].trim();
          stackVariables.push({
            name: varName,
            type: typeof parseInt(val, 10) === 'number' && !isNaN(parseInt(val, 10)) ? 'int (28B)' : 'str ref (48B)',
            address: '0x' + (stackBaseAddr -= 8).toString(16),
            value: val,
            isPointer: val.startsWith('"') || val.startsWith("'"),
            desc: `Python namespace identifier binding`
          });
        }
      });
    } else if (lang === 'rust') {
      let boxCounter = 1;
      lines.forEach((line) => {
        // Box / Vec heap allocation: Box::new(...) or vec![...]
        if (line.includes('Box::new') || line.includes('vec!')) {
          const varMatch = line.match(/let\s+(?:mut\s+)?(\w+)/);
          const varName = varMatch ? varMatch[1] : `box_${boxCounter}`;
          const heapAddr = '0x' + (heapBaseAddr + boxCounter * 0x38).toString(16);
          const heapId = `rust-heap-${boxCounter++}`;

          heapBlocks.push({
            id: heapId,
            label: `Rust Heap Allocation (${varName})`,
            address: heapAddr,
            size: '24 bytes (Ptr + Cap + Len)',
            type: 'Owned Heap Memory',
            data: ['0x10', '0x20', '0x30'],
            referencedBy: [varName]
          });

          stackVariables.push({
            name: varName,
            type: 'owned handle (24B)',
            address: '0x' + (stackBaseAddr -= 24).toString(16),
            value: heapAddr,
            isPointer: true,
            targetHeapId: heapId,
            desc: `Unique owner pointer with RAII automatic deallocation`
          });
          return;
        }

        // Borrow / Reference: let r = &x;
        const refMatch = line.match(/let\s+(?:mut\s+)?(\w+)\s*=\s*&(\w+)/);
        if (refMatch) {
          const refName = refMatch[1];
          const targetName = refMatch[2];
          stackVariables.push({
            name: refName,
            type: '&reference (8B)',
            address: '0x' + (stackBaseAddr -= 8).toString(16),
            value: '0x7ffeefbff540',
            isPointer: true,
            targetVarName: targetName,
            desc: `Immutable borrow with compile-time lifetime check`
          });
          return;
        }

        // Stack primitive: let x = 42;
        const primMatch = line.match(/let\s+(?:mut\s+)?(\w+)(?:\s*:\s*\w+)?\s*=\s*([^;]+);/);
        if (primMatch) {
          const varName = primMatch[1];
          const val = primMatch[2].trim();
          stackVariables.push({
            name: varName,
            type: 'i32 (4B)',
            address: '0x' + (stackBaseAddr -= 4).toString(16),
            value: val,
            isPointer: false,
            desc: `Stack-allocated Rust local binding`
          });
        }
      });
    }

    // Default Fallback if no variables were matched
    if (stackVariables.length === 0) {
      stackVariables.push(
        {
          name: 'ptr',
          type: 'pointer (8B)',
          address: '0x7ffeefbff558',
          value: '0x55a80140',
          isPointer: true,
          targetHeapId: 'heap-demo-1',
          desc: 'Base reference pointer to allocated heap memory'
        },
        {
          name: 'count',
          type: 'int (4B)',
          address: '0x7ffeefbff550',
          value: '42',
          isPointer: false,
          desc: 'Stack scalar integer variable'
        }
      );

      heapBlocks.push({
        id: 'heap-demo-1',
        label: 'Dynamic Heap Chunk',
        address: '0x55a80140',
        size: '16 bytes',
        type: 'Allocated Chunk',
        data: ['0x2A', '0x00', '0x00', '0x00'],
        referencedBy: ['ptr']
      });
    }

    return {
      architecture: 'x86-64 / 64-bit Virtual Memory',
      stackFrames: [
        {
          functionName: 'main()',
          frameBase: '0x7ffeefbff560',
          variables: stackVariables
        }
      ],
      heapBlocks: heapBlocks
    };
  },

  /**
   * Render the visual memory model into target DOM container.
   * @param {HTMLElement|string} targetContainer
   * @param {object} memoryModel
   */
  render(targetContainer, memoryModel) {
    const container = typeof targetContainer === 'string' ? Utils.qs(targetContainer) : targetContainer;
    if (!container) return;

    const frame = (memoryModel && memoryModel.stackFrames && memoryModel.stackFrames[0]) ? memoryModel.stackFrames[0] : null;
    const heap = (memoryModel && memoryModel.heapBlocks) ? memoryModel.heapBlocks : [];

    const stackHtml = `
      <div class="memory-column">
        <div class="memory-column-header">
          <span class="mem-header-title">🥞 Call Stack: ${frame ? frame.functionName : 'main()'}</span>
          <span class="mem-header-addr">RBP: ${frame ? frame.frameBase : '0x7ffe...'}</span>
        </div>
        <div class="memory-frame-box" id="stack-frame-box">
          ${frame && frame.variables.length > 0 ? frame.variables.map(v => `
            <div class="mem-var-row ${v.isPointer ? 'is-pointer-var' : ''}" data-var-name="${v.name}" data-target-heap="${v.targetHeapId || ''}" data-target-var="${v.targetVarName || ''}" title="${v.desc}">
              <div class="mem-var-meta">
                <span class="mem-var-name">${v.name}</span>
                <span class="mem-var-type">${v.type}</span>
              </div>
              <div class="mem-var-cells">
                <span class="mem-var-addr">${v.address}</span>
                <span class="mem-var-val ${v.isPointer ? 'is-ptr-val' : ''}">${v.value}${v.isPointer ? ' ↗' : ''}</span>
              </div>
            </div>
          `).join('') : '<div style="color: var(--text-muted); font-size: 11px; padding: 0.5rem;">No local stack variables</div>'}
        </div>
      </div>
    `;

    const heapHtml = `
      <div class="memory-column">
        <div class="memory-column-header">
          <span class="mem-header-title">📦 Dynamic Heap Allocations</span>
          <span class="mem-header-addr">HEAP: 0x55a80120</span>
        </div>
        <div class="memory-frame-box" id="heap-frame-box">
          ${heap.length > 0 ? heap.map(h => `
            <div class="mem-heap-block" id="heap-block-${h.id}" data-heap-id="${h.id}">
              <div class="mem-heap-header">
                <span class="mem-heap-label">${h.label}</span>
                <span class="mem-heap-addr">${h.address}</span>
              </div>
              <div class="mem-heap-data-row">
                ${h.data.map((item, idx) => `
                  <div class="mem-data-cell" title="Offset +${idx * 4} bytes">
                    <span class="mem-data-idx">[${idx}]</span>
                    <span class="mem-data-val">${Utils.escapeHtml(item)}</span>
                  </div>
                `).join('')}
              </div>
              <div class="mem-heap-footer">
                <span class="badge badge-neutral" style="font-size: 9px;">${h.size}</span>
                <span style="font-size: 10px; color: var(--color-cyan);">Ref: ${h.referencedBy.join(', ')}</span>
              </div>
            </div>
          `).join('') : '<div style="color: var(--text-muted); font-size: 11px; padding: 0.5rem;">No active dynamic heap allocations</div>'}
        </div>
      </div>
    `;

    container.innerHTML = stackHtml + heapHtml;

    // Attach Interactive Pointer Hover Links
    const pointerRows = container.querySelectorAll('.mem-var-row.is-pointer-var');
    pointerRows.forEach(row => {
      const targetHeapId = row.getAttribute('data-target-heap');
      const targetBlock = targetHeapId ? container.querySelector(`[data-heap-id="${targetHeapId}"]`) : null;

      row.addEventListener('mouseenter', () => {
        row.classList.add('is-hovered-pointer');
        if (targetBlock) {
          targetBlock.classList.add('is-highlighted-target');
        }
      });

      row.addEventListener('mouseleave', () => {
        row.classList.remove('is-hovered-pointer');
        if (targetBlock) {
          targetBlock.classList.remove('is-highlighted-target');
        }
      });
    });

    const heapBlockEls = container.querySelectorAll('.mem-heap-block');
    heapBlockEls.forEach(block => {
      const heapId = block.getAttribute('data-heap-id');
      const referringRows = container.querySelectorAll(`[data-target-heap="${heapId}"]`);

      block.addEventListener('mouseenter', () => {
        block.classList.add('is-highlighted-target');
        referringRows.forEach(r => r.classList.add('is-hovered-pointer'));
      });

      block.addEventListener('mouseleave', () => {
        block.classList.remove('is-highlighted-target');
        referringRows.forEach(r => r.classList.remove('is-hovered-pointer'));
      });
    });
  }
};
