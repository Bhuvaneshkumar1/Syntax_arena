/**
 * Assembly & Reverse Engineering Track Question Bank Builder (Step 4)
 * Builds:
 * 1. data/asm-questions.js (60 curated campaign questions: 20 beg, 20 int, 20 exp)
 * 2. 200 questions in data/endless-questions.js under the 'asm' key.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const pad = (n, width = 3) => String(n).padStart(width, '0');

// ============================================================================
// 60 CURATED CAMPAIGN QUESTIONS
// ============================================================================
const CAMPAIGN_QUESTIONS = [
  // --------------------------------------------------------------------------
  // BEGINNER (20 Questions: asm-beg-001 to asm-beg-020)
  // --------------------------------------------------------------------------
  {
    id: 'asm-beg-001',
    language: 'asm',
    difficulty: 'beginner',
    type: 'predict_output',
    topic: 'registers',
    subtopic: 'x86_64_subregisters',
    standardVersion: 'x86-64 Intel Syntax',
    prompt: 'What value is held in the 64-bit RAX register after executing this instruction sequence?',
    code: `mov rax, 0x1122334455667788
mov eax, 0x00000000`,
    options: ['0x0000000000000000', '0x1122334400000000', '0x0000000055667788', '0x1122334455667788'],
    correctAnswer: '0x0000000000000000',
    acceptedAnswers: ['0x0000000000000000', '0x0', '0'],
    hint: 'In x86-64, writing to any 32-bit sub-register (like EAX) automatically zeroes the upper 32 bits.',
    explanation: 'A fundamental rule of x86-64 execution is that any operation writing to a 32-bit register (such as EAX, EBX, etc.) automatically zeroes the upper 32 bits of the corresponding 64-bit register (RAX). Therefore, RAX becomes 0x0000000000000000.',
    points: 100,
    estimatedSeconds: 30,
    tags: ['asm', 'x86_64', 'registers', 'zero_extension']
  },
  {
    id: 'asm-beg-002',
    language: 'asm',
    difficulty: 'beginner',
    type: 'multiple_choice',
    topic: 'idioms',
    subtopic: 'xor_zeroing',
    standardVersion: 'x86-64 Assembly',
    prompt: 'Why do optimizing compilers almost universally emit `xor eax, eax` instead of `mov eax, 0` to set a register to zero?',
    code: `xor eax, eax  ; vs mov eax, 0`,
    options: [
      '`xor eax, eax` uses fewer opcode bytes (2 vs 5) and breaks CPU dependency chains with special register renaming hardware',
      '`mov eax, 0` causes a CPU divide-by-zero trap',
      '`xor` preserves the FLAGS register while `mov` modifies it',
      '`mov` cannot accept immediate zero values in protected mode'
    ],
    correctAnswer: '`xor eax, eax` uses fewer opcode bytes (2 vs 5) and breaks CPU dependency chains with special register renaming hardware',
    acceptedAnswers: ['`xor eax, eax` uses fewer opcode bytes (2 vs 5) and breaks CPU dependency chains with special register renaming hardware'],
    hint: 'Consider both binary instruction encoding length and out-of-order execution pipeline optimizations.',
    explanation: '`xor reg, reg` encodes in just 2 bytes (0x31, 0xC0) compared to 5 bytes for `mov reg, 0` (0xB8, 0x00, 0x00, 0x00, 0x00). Modern x86 processors recognize `xor self, self` during the decode stage and eliminate false data dependencies without waiting for execution units.',
    points: 100,
    estimatedSeconds: 30,
    tags: ['asm', 'x86_64', 'optimization', 'encoding']
  },
  {
    id: 'asm-beg-003',
    language: 'asm',
    difficulty: 'beginner',
    type: 'predict_output',
    topic: 'flags',
    subtopic: 'zero_flag_evaluation',
    standardVersion: 'x86-64 Assembly',
    prompt: 'What are the values of the Zero Flag (ZF) and Sign Flag (SF) after executing these instructions?',
    code: `mov eax, 10
sub eax, 10`,
    options: ['ZF = 1, SF = 0', 'ZF = 0, SF = 0', 'ZF = 1, SF = 1', 'ZF = 0, SF = 1'],
    correctAnswer: 'ZF = 1, SF = 0',
    acceptedAnswers: ['ZF = 1, SF = 0'],
    hint: 'The Zero Flag is set to 1 whenever an arithmetic result equals exactly zero.',
    explanation: 'Subtracting 10 from 10 yields 0. The result is zero, so the Zero Flag (ZF) is set to 1. Since 0 is non-negative (most significant bit is 0), the Sign Flag (SF) remains 0.',
    points: 100,
    estimatedSeconds: 30,
    tags: ['asm', 'flags', 'rflags', 'arithmetic']
  },
  {
    id: 'asm-beg-004',
    language: 'asm',
    difficulty: 'beginner',
    type: 'multiple_choice',
    topic: 'memory',
    subtopic: 'endianness',
    standardVersion: 'x86 Architecture',
    prompt: 'On little-endian x86-64 architecture, how is the 32-bit integer `0xAABBCCDD` stored sequentially in memory starting at address `0x1000`?',
    code: `Address:  0x1000  0x1001  0x1002  0x1003
Bytes:    [  ?  ] [  ?  ] [  ?  ] [  ?  ]`,
    options: [
      'DD CC BB AA',
      'AA BB CC DD',
      'BB AA DD CC',
      'CC DD AA BB'
    ],
    correctAnswer: 'DD CC BB AA',
    acceptedAnswers: ['DD CC BB AA'],
    hint: 'Little-endian stores the least significant byte (LSB) at the lowest memory address.',
    explanation: 'In little-endian byte ordering, the least significant byte (0xDD) is stored at the lowest address (0x1000), followed by 0xCC at 0x1001, 0xBB at 0x1002, and the most significant byte (0xAA) at 0x1003.',
    points: 100,
    estimatedSeconds: 30,
    tags: ['asm', 'endianness', 'memory_layout']
  },
  {
    id: 'asm-beg-005',
    language: 'asm',
    difficulty: 'beginner',
    type: 'predict_output',
    topic: 'arithmetic',
    subtopic: 'shift_operations',
    standardVersion: 'x86-64 Intel Syntax',
    prompt: 'What value is in EAX after shifting right by 2 bits?',
    code: `mov eax, 20
shr eax, 2`,
    options: ['5', '80', '10', '0'],
    correctAnswer: '5',
    acceptedAnswers: ['5'],
    hint: 'Logical shift right (SHR) by N bits is equivalent to unsigned integer division by 2^N.',
    explanation: '`shr eax, 2` shifts the binary value of 20 (`00010100b`) two positions to the right, yielding `00000101b`, which is 5 (20 / 4 = 5).',
    points: 100,
    estimatedSeconds: 30,
    tags: ['asm', 'bitwise', 'shifts']
  },
  {
    id: 'asm-beg-006',
    language: 'asm',
    difficulty: 'beginner',
    type: 'multiple_choice',
    topic: 'syntax',
    subtopic: 'intel_vs_att',
    standardVersion: 'Assembly Syntax',
    prompt: 'In AT&T syntax vs Intel syntax, what is the order of source and destination operands in a standard MOV instruction?',
    code: `Intel:  mov <dest>, <src>
AT&T:   mov <src>,  <dest>`,
    options: [
      'Intel uses "op dest, src"; AT&T uses "op src, dest" (prefixed with % for registers and $ for immediates)',
      'Intel and AT&T both use "op src, dest"',
      'Intel uses "op src, dest"; AT&T uses "op dest, src"',
      'AT&T syntax does not support the mov instruction'
    ],
    correctAnswer: 'Intel uses "op dest, src"; AT&T uses "op src, dest" (prefixed with % for registers and $ for immediates)',
    acceptedAnswers: ['Intel uses "op dest, src"; AT&T uses "op src, dest" (prefixed with % for registers and $ for immediates)'],
    hint: 'Intel reads like an assignment statement: dest = src.',
    explanation: 'Intel syntax follows the destination-first convention (`mov eax, 1` means `eax = 1`), whereas AT&T syntax places the source first (`movl $1, %eax`), with registers prefixed by `%` and immediate values prefixed by `$`.',
    points: 100,
    estimatedSeconds: 30,
    tags: ['asm', 'syntax', 'intel_vs_att']
  },
  {
    id: 'asm-beg-007',
    language: 'asm',
    difficulty: 'beginner',
    type: 'predict_output',
    topic: 'branching',
    subtopic: 'conditional_jumps',
    standardVersion: 'x86-64 Intel Syntax',
    prompt: 'What value is in EAX at the conclusion of this code snippet?',
    code: `  mov eax, 5
  cmp eax, 10
  jge .target
  add eax, 3
.target:
  add eax, 2`,
    options: ['10', '7', '8', '5'],
    correctAnswer: '10',
    acceptedAnswers: ['10'],
    hint: 'Is 5 greater than or equal to 10? If not, JGE is not taken.',
    explanation: '`cmp eax, 10` compares 5 with 10. Since 5 is NOT greater than or equal to 10, `jge .target` is not taken. Execution falls through to `add eax, 3` (eax becomes 8), and then continues to `.target` executing `add eax, 2` (eax becomes 10).',
    points: 100,
    estimatedSeconds: 30,
    tags: ['asm', 'branching', 'jumps', 'control_flow']
  },
  {
    id: 'asm-beg-008',
    language: 'asm',
    difficulty: 'beginner',
    type: 'multiple_choice',
    topic: 'stack',
    subtopic: 'stack_growth_direction',
    standardVersion: 'x86-64 System Architecture',
    prompt: 'In x86-64 architecture, in which direction does the call stack grow when items are pushed?',
    code: `push rax  ; How does RSP change?`,
    options: [
      'Downwards towards lower memory addresses (RSP decreases by 8)',
      'Upwards towards higher memory addresses (RSP increases by 8)',
      'Statically within a fixed page without changing RSP',
      'In whichever direction the operating system decides at boot'
    ],
    correctAnswer: 'Downwards towards lower memory addresses (RSP decreases by 8)',
    acceptedAnswers: ['Downwards towards lower memory addresses (RSP decreases by 8)'],
    hint: 'Pushing a 64-bit value subtracts 8 from RSP.',
    explanation: 'The x86 and x86-64 call stack grows downward toward lower memory addresses. Executing `push rax` subtracts 8 from the stack pointer `%rsp` and writes the 64-bit value to `[rsp]`.',
    points: 100,
    estimatedSeconds: 30,
    tags: ['asm', 'stack', 'rsp', 'memory']
  },
  {
    id: 'asm-beg-009',
    language: 'asm',
    difficulty: 'beginner',
    type: 'predict_output',
    topic: 'instructions',
    subtopic: 'lea_arithmetic',
    standardVersion: 'x86-64 Intel Syntax',
    prompt: 'What value is loaded into EAX by this LEA (Load Effective Address) instruction?',
    code: `mov ecx, 5
lea eax, [ecx + ecx*4 + 2]`,
    options: ['27', '25', '22', '32'],
    correctAnswer: '27',
    acceptedAnswers: ['27'],
    hint: 'LEA computes address arithmetic without accessing memory: 5 + (5 * 4) + 2.',
    explanation: '`lea` computes the memory address expression inside the brackets without dereferencing RAM. Here: `5 + (5 * 4) + 2` = `5 + 20 + 2` = `27`. EAX receives 27.',
    points: 100,
    estimatedSeconds: 30,
    tags: ['asm', 'lea', 'addressing', 'arithmetic']
  },
  {
    id: 'asm-beg-010',
    language: 'asm',
    difficulty: 'beginner',
    type: 'multiple_choice',
    topic: 'registers',
    subtopic: 'instruction_pointer',
    standardVersion: 'x86-64 Architecture',
    prompt: 'Which register holds the memory address of the next instruction to be fetched and executed by the CPU in 64-bit mode?',
    code: `; CPU execution tracker register`,
    options: ['RIP (Instruction Pointer)', 'RSP (Stack Pointer)', 'RBP (Base Pointer)', 'RFLAGS (Flag Register)'],
    correctAnswer: 'RIP (Instruction Pointer)',
    acceptedAnswers: ['RIP (Instruction Pointer)', 'RIP'],
    hint: 'RIP stands for 64-bit Instruction Pointer.',
    explanation: 'The `RIP` register (Instruction Pointer) points to the memory address of the next machine code instruction to execute. In 32-bit mode it is EIP, and in 16-bit mode it is IP.',
    points: 100,
    estimatedSeconds: 30,
    tags: ['asm', 'rip', 'registers', 'cpu']
  },
  {
    id: 'asm-beg-011',
    language: 'asm',
    difficulty: 'beginner',
    type: 'predict_output',
    topic: 'bitwise',
    subtopic: 'test_instruction',
    standardVersion: 'x86-64 Assembly',
    prompt: 'What does the TEST instruction do to its destination operand?',
    code: `mov eax, 42
test eax, eax`,
    options: [
      'Performs bitwise AND and updates FLAGS without modifying EAX',
      'Clears EAX to 0 if EAX is even',
      'Inverts all bits of EAX',
      'Subtracts EAX from EAX and stores result in EAX'
    ],
    correctAnswer: 'Performs bitwise AND and updates FLAGS without modifying EAX',
    acceptedAnswers: ['Performs bitwise AND and updates FLAGS without modifying EAX'],
    hint: 'TEST is to AND what CMP is to SUB: it only updates condition codes.',
    explanation: '`test reg, reg` computes the bitwise AND between operands and updates the condition flags (ZF, SF, PF) while discarding the result, leaving the operands unchanged. `test eax, eax` is commonly used to test if EAX is zero or negative.',
    points: 100,
    estimatedSeconds: 30,
    tags: ['asm', 'test', 'flags', 'bitwise']
  },
  {
    id: 'asm-beg-012',
    language: 'asm',
    difficulty: 'beginner',
    type: 'multiple_choice',
    topic: 'registers',
    subtopic: 'register_byte_parts',
    standardVersion: 'x86 Architecture',
    prompt: 'Which sub-register represents the least significant 8 bits of the 64-bit RBX register?',
    code: `RBX: [        64 bits        ]
EBX:          [    32 bits    ]
BX:                 [ 16 bits ]
??:                     [8bits]`,
    options: ['BL', 'BH', 'BX', 'EBX'],
    correctAnswer: 'BL',
    acceptedAnswers: ['BL'],
    hint: 'The "L" stands for Low byte; "H" stands for High byte of the lower 16 bits.',
    explanation: '`BL` is the lowest 8 bits (bits 0-7) of RBX. `BH` is the next 8 bits (bits 8-15). `BX` is the lowest 16 bits (bits 0-15), and `EBX` is the lowest 32 bits (bits 0-31).',
    points: 100,
    estimatedSeconds: 30,
    tags: ['asm', 'registers', 'x86_64']
  },
  {
    id: 'asm-beg-013',
    language: 'asm',
    difficulty: 'beginner',
    type: 'predict_output',
    topic: 'instructions',
    subtopic: 'imul_two_operand',
    standardVersion: 'x86-64 Intel Syntax',
    prompt: 'What is the value of EAX after executing this multiplication?',
    code: `mov eax, 7
imul eax, 6`,
    options: ['42', '13', '1', '49'],
    correctAnswer: '42',
    acceptedAnswers: ['42'],
    hint: 'The two-operand form of IMUL computes dest = dest * src.',
    explanation: '`imul eax, 6` multiplies the current value of EAX (7) by 6, storing the product 42 back into EAX.',
    points: 100,
    estimatedSeconds: 30,
    tags: ['asm', 'imul', 'arithmetic']
  },
  {
    id: 'asm-beg-014',
    language: 'asm',
    difficulty: 'beginner',
    type: 'multiple_choice',
    topic: 'calling_convention',
    subtopic: 'sysv_first_arg',
    standardVersion: 'System V AMD64 ABI',
    prompt: 'Under the standard Linux/macOS System V AMD64 ABI, in which register is the FIRST integer argument passed to a function?',
    code: `void foo(int a, int b, int c);
// Where does argument 'a' live?`,
    options: ['RDI', 'RSI', 'RAX', 'RCX'],
    correctAnswer: 'RDI',
    acceptedAnswers: ['RDI', 'rdi'],
    hint: 'The System V calling convention order begins: RDI, RSI, RDX...',
    explanation: 'Under System V AMD64 ABI (Linux, macOS, BSD), the first six integer or pointer arguments are passed in: RDI, RSI, RDX, RCX, R8, and R9. (Microsoft Windows x64 uses RCX, RDX, R8, R9).',
    points: 100,
    estimatedSeconds: 30,
    tags: ['asm', 'calling_convention', 'abi', 'sysv']
  },
  {
    id: 'asm-beg-015',
    language: 'asm',
    difficulty: 'beginner',
    type: 'predict_output',
    topic: 'instructions',
    subtopic: 'movzx_zero_extend',
    standardVersion: 'x86-64 Intel Syntax',
    prompt: 'What value is in EAX after zero-extending a byte containing 0xFF?',
    code: `mov al, 0xFF
movzx eax, al`,
    options: ['0x000000FF (255)', '0xFFFFFFFF (-1)', '0x00000000 (0)', '0x0000FF00'],
    correctAnswer: '0x000000FF (255)',
    acceptedAnswers: ['0x000000FF (255)', '0x000000FF', '255'],
    hint: 'MOVZX zeroes all upper bits during transfer; MOVSX sign-extends.',
    explanation: '`movzx` (Move with Zero-Extend) copies the 8-bit value `0xFF` into the 32-bit register `eax` while filling all upper 24 bits with zeroes, producing `0x000000FF` (255).',
    points: 100,
    estimatedSeconds: 30,
    tags: ['asm', 'movzx', 'zero_extension']
  },
  {
    id: 'asm-beg-016',
    language: 'asm',
    difficulty: 'beginner',
    type: 'multiple_choice',
    topic: 'arm64',
    subtopic: 'arm64_instruction_size',
    standardVersion: 'ARMv8-A (AArch64)',
    prompt: 'What is the fixed instruction word size in the ARM64 (AArch64) instruction set architecture?',
    code: `// AArch64 machine code instructions`,
    options: ['Strictly 32 bits (4 bytes)', 'Variable from 1 to 15 bytes', 'Strictly 64 bits (8 bytes)', 'Strictly 16 bits (2 bytes)'],
    correctAnswer: 'Strictly 32 bits (4 bytes)',
    acceptedAnswers: ['Strictly 32 bits (4 bytes)', '32 bits', '4 bytes'],
    hint: 'Unlike variable-length CISC x86, standard A64 instructions are fixed-length RISC words.',
    explanation: 'In ARM64 (AArch64), all machine code instructions are fixed at exactly 32 bits (4 bytes) in length, aligning with standard RISC architecture design principles.',
    points: 100,
    estimatedSeconds: 30,
    tags: ['asm', 'arm64', 'risc', 'architecture']
  },
  {
    id: 'asm-beg-017',
    language: 'asm',
    difficulty: 'beginner',
    type: 'predict_output',
    topic: 'instructions',
    subtopic: 'neg_instruction',
    standardVersion: 'x86-64 Intel Syntax',
    prompt: 'What value is in EAX after applying the NEG instruction to 5?',
    code: `mov eax, 5
neg eax`,
    options: ['-5 (two\'s complement representation)', '5', '0', '-6'],
    correctAnswer: '-5 (two\'s complement representation)',
    acceptedAnswers: ['-5 (two\'s complement representation)', '-5'],
    hint: 'NEG computes the two\'s complement negation: 0 - operand.',
    explanation: 'The `neg` instruction replaces the operand with its arithmetic two\'s complement negation (`0 - eax`). Starting from 5, EAX becomes -5 (`0xFFFFFFFB`).',
    points: 100,
    estimatedSeconds: 30,
    tags: ['asm', 'neg', 'twos_complement']
  },
  {
    id: 'asm-beg-018',
    language: 'asm',
    difficulty: 'beginner',
    type: 'multiple_choice',
    topic: 'arm64',
    subtopic: 'arm64_registers',
    standardVersion: 'ARMv8-A (AArch64)',
    prompt: 'In ARM64, what is the naming convention for 64-bit general-purpose registers vs their 32-bit lower halves?',
    code: `64-bit: X0 - X30
32-bit: ?? - ??`,
    options: [
      'X0-X30 for 64-bit; W0-W30 for 32-bit',
      'R0-R30 for 64-bit; E0-E30 for 32-bit',
      'Q0-Q30 for 64-bit; D0-D30 for 32-bit',
      'A0-A30 for 64-bit; B0-B30 for 32-bit'
    ],
    correctAnswer: 'X0-X30 for 64-bit; W0-W30 for 32-bit',
    acceptedAnswers: ['X0-X30 for 64-bit; W0-W30 for 32-bit'],
    hint: 'Think "X" for extended (64-bit) and "W" for word (32-bit).',
    explanation: 'In AArch64, the 31 general-purpose registers are accessed as `X0` through `X30` when operating on 64-bit data, and as `W0` through `W30` when operating on the lower 32-bit word.',
    points: 100,
    estimatedSeconds: 30,
    tags: ['asm', 'arm64', 'registers', 'aarch64']
  },
  {
    id: 'asm-beg-019',
    language: 'asm',
    difficulty: 'beginner',
    type: 'predict_output',
    topic: 'bitwise',
    subtopic: 'not_vs_neg',
    standardVersion: 'x86-64 Intel Syntax',
    prompt: 'What is the decimal value of AL after bitwise NOT on 0?',
    code: `mov al, 0
not al`,
    options: ['255 (0xFF)', '0', '1', '-128'],
    correctAnswer: '255 (0xFF)',
    acceptedAnswers: ['255 (0xFF)', '255', '0xFF'],
    hint: 'NOT flips every bit (one\'s complement): 00000000 becomes 11111111.',
    explanation: '`not al` performs a bitwise inversion of all 8 bits. Inverting `00000000b` (0) gives `11111111b`, which is `0xFF` or 255 in unsigned 8-bit arithmetic.',
    points: 100,
    estimatedSeconds: 30,
    tags: ['asm', 'not', 'bitwise']
  },
  {
    id: 'asm-beg-020',
    language: 'asm',
    difficulty: 'beginner',
    type: 'multiple_choice',
    topic: 'memory',
    subtopic: 'nop_instruction',
    standardVersion: 'x86 Architecture',
    prompt: 'What opcode byte represents the x86 single-byte NOP (No Operation) instruction?',
    code: `; Machine byte for standard 1-byte NOP`,
    options: ['0x90', '0xCC', '0x00', '0xC3'],
    correctAnswer: '0x90',
    acceptedAnswers: ['0x90'],
    hint: '0x90 is internally decoded as `xchg eax, eax`. (0xCC is INT 3, 0xC3 is RET).',
    explanation: 'The 1-byte x86 NOP instruction is encoded as `0x90`. Historically, the CPU architecture defined `0x90` as an alias for `xchg eax, eax`, which performs no observable state change.',
    points: 100,
    estimatedSeconds: 30,
    tags: ['asm', 'nop', 'opcodes', 'encoding']
  },

  // --------------------------------------------------------------------------
  // INTERMEDIATE (20 Questions: asm-int-001 to asm-int-020)
  // --------------------------------------------------------------------------
  {
    id: 'asm-int-001',
    language: 'asm',
    difficulty: 'intermediate',
    type: 'multiple_choice',
    topic: 'stack_frame',
    subtopic: 'function_prologue',
    standardVersion: 'x86-64 Assembly',
    prompt: 'What is the purpose of the classic standard function prologue sequence in x86-64?',
    code: `push rbp
mov rbp, rsp
sub rsp, 32`,
    options: [
      'Saves the caller\'s base pointer, establishes the current stack frame anchor, and allocates 32 bytes for local stack variables',
      'Pushes 32 arguments into the CPU pipeline',
      'Flushes the TLB cache before executing user code',
      'Initializes the return value in RAX to 32'
    ],
    correctAnswer: 'Saves the caller\'s base pointer, establishes the current stack frame anchor, and allocates 32 bytes for local stack variables',
    acceptedAnswers: ['Saves the caller\'s base pointer, establishes the current stack frame anchor, and allocates 32 bytes for local stack variables'],
    hint: 'RBP serves as a stable base pointer to index local variables and arguments.',
    explanation: '`push rbp` saves the caller\'s frame pointer. `mov rbp, rsp` establishes the current function\'s frame pointer. `sub rsp, 32` moves the stack pointer down to allocate 32 bytes of stack memory for local variables.',
    points: 200,
    estimatedSeconds: 35,
    tags: ['asm', 'stack_frame', 'prologue', 'rbp']
  },
  {
    id: 'asm-int-002',
    language: 'asm',
    difficulty: 'intermediate',
    type: 'predict_output',
    topic: 'control_flow',
    subtopic: 'loop_reconstruction',
    standardVersion: 'x86-64 Disassembly',
    prompt: 'How many times does the loop body execute in this disassembly snippet?',
    code: `  mov ecx, 0
.loop:
  inc ecx
  cmp ecx, 5
  jl .loop`,
    options: ['5', '4', '6', 'Infinite loop'],
    correctAnswer: '5',
    acceptedAnswers: ['5'],
    hint: 'Trace ecx: starts at 0 -> 1, 2, 3, 4, 5. When ecx reaches 5, is 5 < 5?',
    explanation: 'The loop executes with ecx=1 (1 < 5 -> jump), ecx=2 (2 < 5 -> jump), ecx=3 (3 < 5 -> jump), ecx=4 (4 < 5 -> jump), and ecx=5 (5 < 5 is false -> fall through). Total loop iterations = 5.',
    points: 200,
    estimatedSeconds: 35,
    tags: ['asm', 'loops', 'decompilation', 'control_flow']
  },
  {
    id: 'asm-int-003',
    language: 'asm',
    difficulty: 'intermediate',
    type: 'multiple_choice',
    topic: 'calling_convention',
    subtopic: 'ms_x64_vs_sysv',
    standardVersion: 'Calling Conventions ABI',
    prompt: 'How does the Microsoft x64 calling convention differ from the System V AMD64 ABI regarding argument registers and shadow space?',
    code: `// Windows x64 vs Linux System V x86-64`,
    options: [
      'Windows uses RCX, RDX, R8, R9 and requires 32 bytes of caller-allocated "shadow space" (homing space) on the stack',
      'Windows passes all arguments strictly on the stack with zero register usage',
      'System V requires 64 bytes of shadow space while Windows requires none',
      'Windows uses RDI, RSI, RDX, RCX and prohibits stack usage'
    ],
    correctAnswer: 'Windows uses RCX, RDX, R8, R9 and requires 32 bytes of caller-allocated "shadow space" (homing space) on the stack',
    acceptedAnswers: ['Windows uses RCX, RDX, R8, R9 and requires 32 bytes of caller-allocated "shadow space" (homing space) on the stack'],
    hint: 'Notice the mandatory 32-byte space immediately above the return address in Windows x64 calls.',
    explanation: 'Windows x64 passes the first four integer/pointer arguments in `RCX, RDX, R8, R9` and requires the caller to allocate 32 bytes of shadow store on the stack right before calling any function, regardless of how many arguments the callee accepts.',
    points: 200,
    estimatedSeconds: 40,
    tags: ['asm', 'calling_convention', 'windows_x64', 'abi']
  },
  {
    id: 'asm-int-004',
    language: 'asm',
    difficulty: 'intermediate',
    type: 'predict_output',
    topic: 'stack_frame',
    subtopic: 'leave_instruction',
    standardVersion: 'x86-64 Assembly',
    prompt: 'The `leave` instruction is equivalent to which two sequential instructions?',
    code: `leave
ret`,
    options: [
      'mov rsp, rbp; pop rbp',
      'pop rbp; mov rsp, rbp',
      'sub rsp, 8; push rbp',
      'xor rbp, rbp; ret'
    ],
    correctAnswer: 'mov rsp, rbp; pop rbp',
    acceptedAnswers: ['mov rsp, rbp; pop rbp'],
    hint: '`leave` tears down the stack frame by restoring the stack pointer and recovering caller RBP.',
    explanation: '`leave` reverses the frame setup of `mov rbp, rsp; push rbp`. It sets `rsp = rbp` (deallocating all local variables) and then executes `pop rbp` to restore the caller\'s saved base pointer.',
    points: 200,
    estimatedSeconds: 30,
    tags: ['asm', 'leave', 'stack_frame', 'epilogue']
  },
  {
    id: 'asm-int-005',
    language: 'asm',
    difficulty: 'intermediate',
    type: 'multiple_choice',
    topic: 'reverse_engineering',
    subtopic: 'structure_offsets',
    standardVersion: 'Disassembly Analysis',
    prompt: 'In this decompilation snippet, what is the memory offset of field `user.role_id` within the struct pointed to by RDI?',
    code: `mov eax, dword ptr [rdi + 16]
cmp eax, 1
je .is_admin`,
    options: ['16 bytes (0x10)', '4 bytes', '8 bytes', '0 bytes'],
    correctAnswer: '16 bytes (0x10)',
    acceptedAnswers: ['16 bytes (0x10)', '16', '0x10', '16 bytes'],
    hint: 'Look directly at the displacement within the base-displacement addressing mode `[rdi + 16]`.',
    explanation: 'In the instruction `mov eax, dword ptr [rdi + 16]`, RDI holds the base pointer to the struct, and `+ 16` is the byte displacement offset where the 4-byte (`dword`) member resides.',
    points: 200,
    estimatedSeconds: 30,
    tags: ['re', 'disassembly', 'structs', 'memory_offset']
  },
  {
    id: 'asm-int-006',
    language: 'asm',
    difficulty: 'intermediate',
    type: 'predict_output',
    topic: 'arm64',
    subtopic: 'arm64_link_register',
    standardVersion: 'ARMv8-A Architecture',
    prompt: 'When the ARM64 instruction `bl target_function` (Branch with Link) is executed, where does the CPU store the return address?',
    code: `bl target_function
; Where is the return address saved?`,
    options: ['In the Link Register (X30 / LR)', 'On the stack at [SP - 8]', 'In register X0', 'In register PC'],
    correctAnswer: 'In the Link Register (X30 / LR)',
    acceptedAnswers: ['In the Link Register (X30 / LR)', 'X30', 'LR', 'Link Register'],
    hint: 'Unlike x86 CALL which pushes to the stack, ARM uses a dedicated link register.',
    explanation: 'The `bl` (Branch with Link) instruction stores the address of the next sequential instruction into register `X30` (the Link Register, `LR`) before jumping to the target label. Callee functions return via `ret`, which branches to X30.',
    points: 200,
    estimatedSeconds: 35,
    tags: ['asm', 'arm64', 'link_register', 'x30', 'bl']
  },
  {
    id: 'asm-int-007',
    language: 'asm',
    difficulty: 'intermediate',
    type: 'multiple_choice',
    topic: 'reverse_engineering',
    subtopic: 'jump_tables',
    standardVersion: 'Disassembly Analysis',
    prompt: 'What high-level C/C++ control structure does this indirect jump pattern typically implement in compiled binaries?',
    code: `cmp eax, 4
ja .default_case
lea rdx, [rip + jtbl]
movsxd rax, dword ptr [rdx + rax*4]
add rax, rdx
jmp rax`,
    options: [
      'A dense `switch` statement implemented via a compiler jump table',
      'A recursive function call',
      'A try/catch exception frame unwind table',
      'An inline assembly memory barrier'
    ],
    correctAnswer: 'A dense `switch` statement implemented via a compiler jump table',
    acceptedAnswers: ['A dense `switch` statement implemented via a compiler jump table'],
    hint: 'A bounds check followed by indexed table offset lookup and indirect jump is the hallmark of this construct.',
    explanation: 'Compilers implement dense `switch` statements by performing a bounds check (`cmp eax, 4; ja default`), indexing into a jump table array of relative code pointers (`[rdx + rax*4]`), and executing an indirect branch (`jmp rax`) directly to the matching case block in O(1) time.',
    points: 200,
    estimatedSeconds: 40,
    tags: ['re', 'disassembly', 'switch', 'jump_table']
  },
  {
    id: 'asm-int-008',
    language: 'asm',
    difficulty: 'intermediate',
    type: 'predict_output',
    topic: 'instructions',
    subtopic: 'cmov_conditional_move',
    standardVersion: 'x86-64 Intel Syntax',
    prompt: 'What value is in EAX after executing this branchless Conditional Move sequence?',
    code: `mov eax, 100
mov ebx, 200
cmp eax, 50
cmovg eax, ebx`,
    options: ['200', '100', '50', '0'],
    correctAnswer: '200',
    acceptedAnswers: ['200'],
    hint: 'CMP compares 100 with 50. Is 100 greater than 50? If so, CMOVG moves EBX into EAX.',
    explanation: '`cmp eax, 50` checks if 100 > 50. Since 100 is strictly greater than 50, the Greater condition holds (ZF=0 and SF=OF). `cmovg eax, ebx` executes the move without a branch, replacing EAX with 200.',
    points: 200,
    estimatedSeconds: 35,
    tags: ['asm', 'cmov', 'branchless', 'optimization']
  },
  {
    id: 'asm-int-009',
    language: 'asm',
    difficulty: 'intermediate',
    type: 'multiple_choice',
    topic: 'security',
    subtopic: 'stack_canaries',
    standardVersion: 'GCC / Clang Security Mitigations',
    prompt: 'How does GCC\'s `-fstack-protector` detect stack-based buffer overflows at runtime in x86-64 Linux?',
    code: `mov rax, qword ptr fs:[0x28]
mov qword ptr [rbp - 8], rax
... ; function body
mov rdx, qword ptr [rbp - 8]
xor rdx, qword ptr fs:[0x28]
jne __stack_chk_fail`,
    options: [
      'Places a secret random guard value ("canary") from thread-local storage (`fs:[0x28]`) between local buffers and the saved return pointer, verifying it before returning',
      'Encrypts the entire stack frame using AES-NI instructions',
      'Allocates all local arrays in kernel space',
      'Restricts stack execution permissions using page table NX bits'
    ],
    correctAnswer: 'Places a secret random guard value ("canary") from thread-local storage (`fs:[0x28]`) between local buffers and the saved return pointer, verifying it before returning',
    acceptedAnswers: ['Places a secret random guard value ("canary") from thread-local storage (`fs:[0x28]`) between local buffers and the saved return pointer, verifying it before returning'],
    hint: 'If a buffer overflow writes past its boundary toward the saved return address, it corrupts the canary first.',
    explanation: 'The stack canary is loaded from the Thread Control Block at `fs:0x28` into `[rbp - 8]`. If a linear stack buffer overflow overwrites toward the saved return address, the canary value is modified. The epilogue XOR check detects this corruption and aborts via `__stack_chk_fail`.',
    points: 200,
    estimatedSeconds: 40,
    tags: ['re', 'security', 'stack_canary', 'mitigation']
  },
  {
    id: 'asm-int-010',
    language: 'asm',
    difficulty: 'intermediate',
    type: 'predict_output',
    topic: 'arm64',
    subtopic: 'arm64_ldr_str_post_index',
    standardVersion: 'ARMv8-A Architecture',
    prompt: 'In ARM64 post-indexed addressing `ldr w1, [x0], #4`, how is X0 updated after loading?',
    code: `; Assume X0 initially holds 0x2000
ldr w1, [x0], #4`,
    options: ['X0 becomes 0x2004 (incremented after memory load)', 'X0 becomes 0x2000 (unchanged)', 'X0 becomes 0x1FFC', 'X0 becomes 4'],
    correctAnswer: 'X0 becomes 0x2004 (incremented after memory load)',
    acceptedAnswers: ['X0 becomes 0x2004 (incremented after memory load)', '0x2004'],
    hint: 'Post-index loads from the current address first, then adds the offset to the base register.',
    explanation: 'In ARM64 post-indexed addressing `[xN], #offset`, the load is performed from address `xN`, and immediately afterward the base register `xN` is incremented by `offset` (`0x2000 + 4 = 0x2004`).',
    points: 200,
    estimatedSeconds: 35,
    tags: ['asm', 'arm64', 'addressing', 'post_index']
  },
  {
    id: 'asm-int-011',
    language: 'asm',
    difficulty: 'intermediate',
    type: 'multiple_choice',
    topic: 'reverse_engineering',
    subtopic: 'virtual_methods',
    standardVersion: 'C++ Binary Abstractions',
    prompt: 'When reversing a 64-bit C++ binary, what does an instruction sequence loading from `[rcx]` and then calling `[rax + 16]` represent?',
    code: `mov rax, qword ptr [rcx]     ; load vtable pointer from *this
call qword ptr [rax + 16]    ; call method through vtable`,
    options: [
      'A polymorphic virtual method call dispatching via the class vtable (virtual method table)',
      'A system call to the Linux kernel via SYSENTER',
      'A hardware breakpoint trigger',
      'An unaligned memory fault handler'
    ],
    correctAnswer: 'A polymorphic virtual method call dispatching via the class vtable (virtual method table)',
    acceptedAnswers: ['A polymorphic virtual method call dispatching via the class vtable (virtual method table)'],
    hint: 'The first quadword of a polymorphic C++ object in memory is its vptr pointing to the function pointer array.',
    explanation: 'Polymorphic C++ classes store a pointer to the vtable (`vptr`) at offset 0 of the object (`*this` in RCX). The call `[rax + 16]` indexes into the third virtual function pointer entry in the vtable (offset 16 = index 2).',
    points: 200,
    estimatedSeconds: 40,
    tags: ['re', 'cpp', 'vtable', 'polymorphism']
  },
  {
    id: 'asm-int-012',
    language: 'asm',
    difficulty: 'intermediate',
    type: 'predict_output',
    topic: 'arithmetic',
    subtopic: 'cdqe_sign_extension',
    standardVersion: 'x86-64 Intel Syntax',
    prompt: 'What value is in RAX after executing CDQE when EAX holds `-1` (`0xFFFFFFFF`)?',
    code: `mov eax, -1
cdqe`,
    options: ['0xFFFFFFFFFFFFFFFF (-1 in 64 bits)', '0x00000000FFFFFFFF', '0x0000000000000001', '0x7FFFFFFFFFFFFFFF'],
    correctAnswer: '0xFFFFFFFFFFFFFFFF (-1 in 64 bits)',
    acceptedAnswers: ['0xFFFFFFFFFFFFFFFF (-1 in 64 bits)', '-1', '0xFFFFFFFFFFFFFFFF'],
    hint: 'CDQE converts doubleword (EAX) to quadword (RAX) with sign-extension.',
    explanation: 'The `cdqe` (Convert Doubleword to Quadword Extended) instruction takes the 32-bit signed integer in EAX and sign-extends it into the full 64-bit RAX register. If the sign bit (bit 31) is 1, all upper 32 bits are filled with 1s (`0xFFFFFFFFFFFFFFFF`).',
    points: 200,
    estimatedSeconds: 30,
    tags: ['asm', 'cdqe', 'sign_extension', 'rax']
  },
  {
    id: 'asm-int-013',
    language: 'asm',
    difficulty: 'intermediate',
    type: 'multiple_choice',
    topic: 'reverse_engineering',
    subtopic: 'xrefs_analysis',
    standardVersion: 'Static Analysis / IDA Pro & Ghidra',
    prompt: 'In reverse engineering tools like Ghidra, IDA Pro, or Binary Ninja, what is a "Cross-Reference" (XREF)?',
    code: `; XREF[2]: main+0x18(j), parse_header+0x40(c)`,
    options: [
      'A tracked relationship indicating which instructions call, jump to, or read/write a specific function or data address',
      'A cross-platform binary translation layer',
      'An encrypted hash verifying binary integrity',
      'A linker symbol table replacement'
    ],
    correctAnswer: 'A tracked relationship indicating which instructions call, jump to, or read/write a specific function or data address',
    acceptedAnswers: ['A tracked relationship indicating which instructions call, jump to, or read/write a specific function or data address'],
    hint: 'XREFs tell you "who calls this function" or "who references this string".',
    explanation: 'Cross-references (XREFs) are indexed relationships generated by disassemblers showing every location in the binary where a specific function, basic block, string, or global variable is accessed, jumped to, or called.',
    points: 200,
    estimatedSeconds: 30,
    tags: ['re', 'static_analysis', 'xrefs', 'ghidra']
  },
  {
    id: 'asm-int-014',
    language: 'asm',
    difficulty: 'intermediate',
    type: 'predict_output',
    topic: 'stack',
    subtopic: 'ret_instruction_mechanics',
    standardVersion: 'x86-64 Architecture',
    prompt: 'What does the standard RET (Near Return) instruction do to the CPU registers?',
    code: `ret`,
    options: [
      'Pops the 64-bit address at [RSP] into RIP and increments RSP by 8',
      'Pops [RSP] into RAX and leaves RSP unchanged',
      'Jumps to RBP and zeroes RIP',
      'Pushes RIP to [RSP] and subtracts 8'
    ],
    correctAnswer: 'Pops the 64-bit address at [RSP] into RIP and increments RSP by 8',
    acceptedAnswers: ['Pops the 64-bit address at [RSP] into RIP and increments RSP by 8'],
    hint: 'RET pops the saved return address from the top of the stack into the instruction pointer.',
    explanation: 'The `ret` instruction fetches the 64-bit return address from memory at the top of the stack (`[rsp]`), loads it into the instruction pointer (`rip`), and adds 8 to `rsp` to pop the stack frame.',
    points: 200,
    estimatedSeconds: 30,
    tags: ['asm', 'ret', 'stack', 'rip']
  },
  {
    id: 'asm-int-015',
    language: 'asm',
    difficulty: 'intermediate',
    type: 'multiple_choice',
    topic: 'reverse_engineering',
    subtopic: 'anti_debugging_ptrace',
    standardVersion: 'Linux Anti-Analysis Techniques',
    prompt: 'Why do Linux malware binaries often call `ptrace(PTRACE_TRACEME, 0, 1, 0)` early in `main()`?',
    code: `if (ptrace(PTRACE_TRACEME, 0, 1, 0) < 0) {
    exit(1); // Debugger detected!
}`,
    options: [
      'A Linux process can only be attached to by at most one tracer (debugger) at a time, so it fails if GDB or IDA is already attached',
      'It grants the binary root kernel privileges',
      'It disables address space layout randomization',
      'It prevents core dumps from being written to /tmp'
    ],
    correctAnswer: 'A Linux process can only be attached to by at most one tracer (debugger) at a time, so it fails if GDB or IDA is already attached',
    acceptedAnswers: ['A Linux process can only be attached to by at most one tracer (debugger) at a time, so it fails if GDB or IDA is already attached'],
    hint: 'Only one process can trace a given target via ptrace at any time.',
    explanation: 'Under the Linux kernel, a process can have only one debugger/tracer attached. By calling `PTRACE_TRACEME`, a process requests to be traced. If a debugger (like GDB) is already attached, the syscall fails with `-1`, allowing the program to detect analysis and abort.',
    points: 200,
    estimatedSeconds: 35,
    tags: ['re', 'anti_debugging', 'ptrace', 'linux']
  },
  {
    id: 'asm-int-016',
    language: 'asm',
    difficulty: 'intermediate',
    type: 'predict_output',
    topic: 'instructions',
    subtopic: 'xchg_atomic',
    standardVersion: 'x86-64 Architecture',
    prompt: 'What values are in EAX and EBX after executing `xchg eax, ebx`?',
    code: `mov eax, 10
mov ebx, 20
xchg eax, ebx`,
    options: ['EAX = 20, EBX = 10', 'EAX = 10, EBX = 20', 'EAX = 30, EBX = 0', 'EAX = 0, EBX = 0'],
    correctAnswer: 'EAX = 20, EBX = 10',
    acceptedAnswers: ['EAX = 20, EBX = 10'],
    hint: 'XCHG atomically swaps the contents of two registers without needing a temporary variable.',
    explanation: 'The `xchg` instruction swaps the values contained in the two specified operands. EAX (originally 10) becomes 20, and EBX (originally 20) becomes 10.',
    points: 200,
    estimatedSeconds: 25,
    tags: ['asm', 'xchg', 'registers']
  },
  {
    id: 'asm-int-017',
    language: 'asm',
    difficulty: 'intermediate',
    type: 'multiple_choice',
    topic: 'abi',
    subtopic: 'callee_vs_caller_saved',
    standardVersion: 'System V AMD64 ABI',
    prompt: 'Under System V AMD64 ABI, which set of registers is "callee-saved" (non-volatile), meaning a function must restore their original values before returning?',
    code: `; Callee-saved registers in System V x86-64`,
    options: [
      'RBX, RBP, R12, R13, R14, R15, and RSP',
      'RAX, RCX, RDX, RSI, RDI, R8, R9',
      'Only RAX and RDX',
      'No registers are callee-saved in 64-bit mode'
    ],
    correctAnswer: 'RBX, RBP, R12, R13, R14, R15, and RSP',
    acceptedAnswers: ['RBX, RBP, R12, R13, R14, R15, and RSP'],
    hint: 'Callee-saved registers must be preserved with PUSH at function start and POP before RET.',
    explanation: 'Under System V AMD64 ABI, registers `RBX`, `RBP`, `RSP`, `R12`, `R13`, `R14`, and `R15` are callee-saved. If a function modifies them, it must restore their original values before returning to the caller.',
    points: 200,
    estimatedSeconds: 35,
    tags: ['asm', 'abi', 'calling_convention', 'sysv']
  },
  {
    id: 'asm-int-018',
    language: 'asm',
    difficulty: 'intermediate',
    type: 'predict_output',
    topic: 'instructions',
    subtopic: 'setcc_instruction',
    standardVersion: 'x86-64 Intel Syntax',
    prompt: 'What value is placed into AL by SETE (Set if Equal)?',
    code: `mov eax, 42
cmp eax, 42
sete al`,
    options: ['1', '0', '42', '255'],
    correctAnswer: '1',
    acceptedAnswers: ['1', '0x1'],
    hint: 'SETE sets the destination 8-bit register to 1 if ZF is 1, and 0 otherwise.',
    explanation: '`cmp eax, 42` compares equal values, setting the Zero Flag (ZF = 1). `sete al` (Set byte if Equal) writes a 1 to AL if ZF is set, and 0 otherwise. Thus AL = 1.',
    points: 200,
    estimatedSeconds: 30,
    tags: ['asm', 'sete', 'setcc', 'flags']
  },
  {
    id: 'asm-int-019',
    language: 'asm',
    difficulty: 'intermediate',
    type: 'multiple_choice',
    topic: 'reverse_engineering',
    subtopic: 'pic_rip_relative',
    standardVersion: 'x86-64 Position Independent Code',
    prompt: 'What does RIP-relative addressing (e.g. `mov rax, [rip + 0x2050]`) accomplish in modern Position-Independent Executables (PIE)?',
    code: `mov rax, qword ptr [rip + 0x2050]`,
    options: [
      'Allows code to reference global data using an offset relative to the current instruction pointer, enabling code to run at any randomized base address',
      'Restricts access strictly to kernel mode memory',
      'Forces the CPU to execute code out of order',
      'Disables CPU branch prediction for security'
    ],
    correctAnswer: 'Allows code to reference global data using an offset relative to the current instruction pointer, enabling code to run at any randomized base address',
    acceptedAnswers: ['Allows code to reference global data using an offset relative to the current instruction pointer, enabling code to run at any randomized base address'],
    hint: 'In PIE binaries with ASLR, the distance between code and data stays constant regardless of load address.',
    explanation: 'In 64-bit Position-Independent Executables (PIE), code is loaded at random base addresses by ASLR. Because the relative offset between instructions and data sections remains constant, RIP-relative addressing accesses globals without requiring runtime address relocations in the code segment.',
    points: 200,
    estimatedSeconds: 40,
    tags: ['asm', 're', 'pie', 'aslr', 'rip_relative']
  },
  {
    id: 'asm-int-020',
    language: 'asm',
    difficulty: 'intermediate',
    type: 'predict_output',
    topic: 'arithmetic',
    subtopic: 'idiv_remainder',
    standardVersion: 'x86-64 Intel Syntax',
    prompt: 'After dividing 17 by 5 with IDIV, which register holds the remainder (2)?',
    code: `mov eax, 17
cdq             ; sign-extend EAX into EDX:EAX
mov ecx, 5
idiv ecx        ; EAX = quotient, EDX = remainder`,
    options: ['EDX', 'EAX', 'ECX', 'EBX'],
    correctAnswer: 'EDX',
    acceptedAnswers: ['EDX', 'edx'],
    hint: 'x86 IDIV/DIV places the quotient in EAX and the remainder in EDX.',
    explanation: 'The x86 `idiv` instruction divides the 64-bit value in `EDX:EAX` by the operand (`ecx = 5`). The quotient (3) is written to EAX, and the remainder (2) is written to EDX.',
    points: 200,
    estimatedSeconds: 30,
    tags: ['asm', 'idiv', 'arithmetic', 'registers']
  },

  // --------------------------------------------------------------------------
  // EXPERT (20 Questions: asm-exp-001 to asm-exp-020)
  // --------------------------------------------------------------------------
  {
    id: 'asm-exp-001',
    language: 'asm',
    difficulty: 'expert',
    type: 'multiple_choice',
    topic: 'security',
    subtopic: 'rop_chains',
    standardVersion: 'Exploitation & Binary Security',
    prompt: 'In Return-Oriented Programming (ROP), what constitutes a "gadget"?',
    code: `; Disassembly at 0x401123:
pop rdi
ret`,
    options: [
      'A short sequence of machine instructions ending in a RET opcode, located in existing executable memory',
      'A malicious kernel module injected at boot',
      'A hardware fault in the CPU arithmetic logic unit',
      'An encrypted shellcode payload stored in the .data section'
    ],
    correctAnswer: 'A short sequence of machine instructions ending in a RET opcode, located in existing executable memory',
    acceptedAnswers: ['A short sequence of machine instructions ending in a RET opcode, located in existing executable memory'],
    hint: 'ROP circumvents non-executable memory (W^X / DEP) by borrowing existing instructions.',
    explanation: 'A ROP gadget is a short sequence of existing instructions in executable binary or library memory (like libc) ending in `ret`. By arranging addresses and data on the stack, attackers chain gadgets to execute arbitrary operations without introducing new executable code.',
    points: 300,
    estimatedSeconds: 45,
    tags: ['re', 'rop', 'exploitation', 'security']
  },
  {
    id: 'asm-exp-002',
    language: 'asm',
    difficulty: 'expert',
    type: 'multiple_choice',
    topic: 'security',
    subtopic: 'rop_sysv_arg_setup',
    standardVersion: 'x86-64 ROP Chain Construction',
    prompt: 'To call `puts(secret_string)` in a 64-bit System V ROP chain, what gadget must be placed on the stack immediately before the string address and puts address?',
    code: `Stack Layout:
[ ? gadget ? ] -> pops argument into RDI
[ &secret_string ]
[ &puts ]`,
    options: ['`pop rdi; ret`', '`push rdi; ret`', '`pop rax; ret`', '`xor rdi, rdi; ret`'],
    correctAnswer: '`pop rdi; ret`',
    acceptedAnswers: ['`pop rdi; ret`', 'pop rdi; ret'],
    hint: 'First argument in System V AMD64 is passed in RDI.',
    explanation: 'The gadget `pop rdi; ret` pops the next value off the stack (`&secret_string`) into `rdi`. The subsequent `ret` pops the next address (`&puts`) into `rip`, invoking `puts` with the desired string pointer in RDI.',
    points: 300,
    estimatedSeconds: 45,
    tags: ['re', 'rop', 'sysv', 'gadgets']
  },
  {
    id: 'asm-exp-003',
    language: 'asm',
    difficulty: 'expert',
    type: 'multiple_choice',
    topic: 'security',
    subtopic: 'aslr_pie_leaks',
    standardVersion: 'Binary Security & Exploitation',
    prompt: 'Under full ASLR + PIE, how does an attacker identify the randomized base address of libc at runtime?',
    code: `// Information leak vector`,
    options: [
      'By leaking an unresolved or resolved GOT (Global Offset Table) entry or stack saved pointer, then subtracting its fixed library offset',
      'By brute-forcing all 2^64 addresses sequentially within 1 millisecond',
      'By executing the CPUID instruction to query ASLR seeds',
      'By issuing a POSIX signal that disables ASLR dynamically'
    ],
    correctAnswer: 'By leaking an unresolved or resolved GOT (Global Offset Table) entry or stack saved pointer, then subtracting its fixed library offset',
    acceptedAnswers: ['By leaking an unresolved or resolved GOT (Global Offset Table) entry or stack saved pointer, then subtracting its fixed library offset'],
    hint: 'Library functions have randomized absolute addresses, but constant relative offsets from libc base.',
    explanation: 'ASLR randomizes the base page of libraries, but the internal offsets between functions in libc remain constant. Once an attacker leaks the runtime address of any libc function (via format string, GOT read, or uninitialized stack data), subtracting that function\'s known static offset yields the libc base address.',
    points: 300,
    estimatedSeconds: 45,
    tags: ['re', 'aslr', 'pie', 'got', 'information_leak']
  },
  {
    id: 'asm-exp-004',
    language: 'asm',
    difficulty: 'expert',
    type: 'multiple_choice',
    topic: 'security',
    subtopic: 'got_plt_redirection',
    standardVersion: 'ELF Dynamic Linking Architecture',
    prompt: 'In dynamically linked ELF binaries, what role do the PLT (Procedure Linkage Table) and GOT (Global Offset Table) play?',
    code: `call puts@plt
; jumps to *puts@got`,
    options: [
      'The PLT provides trampolines that lazily resolve external function symbols on first call and store their addresses in the writable GOT',
      'The PLT contains kernel system call handlers while GOT contains thread-local storage',
      'The GOT encrypts stack frames while PLT validates canaries',
      'The PLT replaces all dynamic calls with static memory copies'
    ],
    correctAnswer: 'The PLT provides trampolines that lazily resolve external function symbols on first call and store their addresses in the writable GOT',
    acceptedAnswers: ['The PLT provides trampolines that lazily resolve external function symbols on first call and store their addresses in the writable GOT'],
    hint: 'Lazy binding delays symbol lookup until the function is first executed.',
    explanation: 'In dynamic ELF binaries, calls to external shared library functions go through a PLT stub (`puts@plt`). On the first invocation, the dynamic linker resolves the symbol\'s actual memory address and writes it into the GOT (`puts@got`). Subsequent calls jump directly through the GOT without re-resolving.',
    points: 300,
    estimatedSeconds: 45,
    tags: ['re', 'elf', 'plt', 'got', 'dynamic_linking']
  },
  {
    id: 'asm-exp-005',
    language: 'asm',
    difficulty: 'expert',
    type: 'multiple_choice',
    topic: 'security',
    subtopic: 'ret2win_stack_smash',
    standardVersion: 'Stack Buffer Overflow Mechanics',
    prompt: 'Given a local buffer at `[rbp - 0x20]` with no stack canary, how many bytes of input overflow are needed to reach and overwrite the saved return address (`[rbp + 0x8]`)?',
    code: `// Stack frame layout:
// [rbp - 0x20]: local buffer (32 bytes)
// [rbp]:        saved caller RBP (8 bytes)
// [rbp + 0x8]:  saved return address RIP (8 bytes)`,
    options: ['40 bytes (32 bytes buffer + 8 bytes saved RBP)', '32 bytes', '24 bytes', '48 bytes'],
    correctAnswer: '40 bytes (32 bytes buffer + 8 bytes saved RBP)',
    acceptedAnswers: ['40 bytes (32 bytes buffer + 8 bytes saved RBP)', '40', '40 bytes'],
    hint: 'To reach [rbp + 8], you must fill the 32-byte buffer and the 8-byte saved frame pointer.',
    explanation: 'The buffer occupies 32 bytes from `rbp - 0x20` to `rbp`. The saved caller RBP occupies 8 bytes from `rbp` to `rbp + 0x8`. Therefore, exactly 40 bytes (32 + 8) of padding are required before the next 8 bytes overwrite the saved return address at `[rbp + 0x8]`.',
    points: 300,
    estimatedSeconds: 40,
    tags: ['re', 'buffer_overflow', 'stack_frame', 'rip_overwrite']
  },
  {
    id: 'asm-exp-006',
    language: 'asm',
    difficulty: 'expert',
    type: 'multiple_choice',
    topic: 'reverse_engineering',
    subtopic: 'relro_protection',
    standardVersion: 'ELF Binary Hardening',
    prompt: 'What vulnerability does Full RELRO (Relocation Read-Only) mitigate in compiled Linux executables?',
    code: `gcc -Wl,-z,relro,-z,now ...`,
    options: [
      'Prevents GOT overwrite attacks by resolving all symbols at startup and marking the GOT page as read-only',
      'Prevents CPU register dumping in core files',
      'Encrypts all user passwords in memory',
      'Disables thread concurrency'
    ],
    correctAnswer: 'Prevents GOT overwrite attacks by resolving all symbols at startup and marking the GOT page as read-only',
    acceptedAnswers: ['Prevents GOT overwrite attacks by resolving all symbols at startup and marking the GOT page as read-only'],
    hint: 'With "-z,now", dynamic linking resolution is completed before main() runs, allowing mprotect() to make GOT read-only.',
    explanation: 'With Partial RELRO, the Global Offset Table (GOT) remains writable so dynamic symbols can be resolved lazily. Full RELRO (`-z,relro -z,now`) forces the linker to resolve all symbols at load time and marks the `.got` and `.got.plt` sections completely read-only (`r--`), defeating GOT overwrite exploits.',
    points: 300,
    estimatedSeconds: 45,
    tags: ['re', 'security', 'relro', 'got', 'hardening']
  },
  {
    id: 'asm-exp-007',
    language: 'asm',
    difficulty: 'expert',
    type: 'multiple_choice',
    topic: 'reverse_engineering',
    subtopic: 'anti_debugging_rdtsc',
    standardVersion: 'x86 Timing Anti-Analysis',
    prompt: 'How does malware utilize the RDTSC (Read Time-Stamp Counter) instruction to detect dynamic analysis in a debugger or sandbox?',
    code: `rdtsc
mov esi, eax
... ; code block
rdtsc
sub eax, esi
cmp eax, 0xFFFFF
ja .debugger_detected`,
    options: [
      'Measures the elapsed CPU cycles across a code block; if significantly high (due to human stepping or breakpoint traps), it flags an interactive debugger',
      'Reads the system clock to determine if the computer is connected to the internet',
      'Overheats the CPU to trigger an thermal shutdown',
      'Checks if the BIOS serial number matches virtual machine strings'
    ],
    correctAnswer: 'Measures the elapsed CPU cycles across a code block; if significantly high (due to human stepping or breakpoint traps), it flags an interactive debugger',
    acceptedAnswers: ['Measures the elapsed CPU cycles across a code block; if significantly high (due to human stepping or breakpoint traps), it flags an interactive debugger'],
    hint: 'RDTSC returns the CPU cycle count in EDX:EAX.',
    explanation: 'RDTSC reads the cumulative count of processor cycles. If a human analyst is single-stepping with a debugger or a hypervisor is intercepting execution with exception traps, thousands of cycles elapse between instructions instead of dozens, exposing the analysis environment.',
    points: 300,
    estimatedSeconds: 45,
    tags: ['re', 'anti_debugging', 'rdtsc', 'timing']
  },
  {
    id: 'asm-exp-008',
    language: 'asm',
    difficulty: 'expert',
    type: 'multiple_choice',
    topic: 'simd',
    subtopic: 'avx_registers',
    standardVersion: 'x86-64 AVX / AVX2',
    prompt: 'What are the register bit-widths of the x86 MMX, SSE (XMM), AVX (YMM), and AVX-512 (ZMM) register families?',
    code: `MMX:     64 bits
XMM:    128 bits
YMM:    ??? bits
ZMM:    ??? bits`,
    options: [
      'YMM is 256 bits; ZMM is 512 bits',
      'YMM is 128 bits; ZMM is 256 bits',
      'YMM is 512 bits; ZMM is 1024 bits',
      'YMM is 64 bits; ZMM is 128 bits'
    ],
    correctAnswer: 'YMM is 256 bits; ZMM is 512 bits',
    acceptedAnswers: ['YMM is 256 bits; ZMM is 512 bits'],
    hint: 'Each generation doubled the vector register width from 128 to 256 to 512.',
    explanation: 'Intel SSE introduced 128-bit `XMM0-XMM15` registers. AVX extended these to 256-bit `YMM0-YMM15` (where the lower 128 bits overlap with XMM). AVX-512 introduced 512-bit `ZMM0-ZMM31` registers.',
    points: 300,
    estimatedSeconds: 35,
    tags: ['asm', 'simd', 'avx', 'vector']
  },
  {
    id: 'asm-exp-009',
    language: 'asm',
    difficulty: 'expert',
    type: 'predict_output',
    topic: 'instructions',
    subtopic: 'bts_bit_test_and_set',
    standardVersion: 'x86-64 Intel Syntax',
    prompt: 'What is the value of EAX and the Carry Flag (CF) after executing `bts eax, 3` when EAX is initially 0?',
    code: `mov eax, 0
bts eax, 3`,
    options: ['EAX = 8, CF = 0', 'EAX = 3, CF = 1', 'EAX = 8, CF = 1', 'EAX = 16, CF = 0'],
    correctAnswer: 'EAX = 8, CF = 0',
    acceptedAnswers: ['EAX = 8, CF = 0'],
    hint: 'BTS copies the selected bit (bit 3) into the Carry Flag, then sets that bit to 1.',
    explanation: '`bts eax, 3` checks bit 3 of EAX. Initially bit 3 is 0, so CF is set to 0. It then sets bit 3 to 1 (`1 << 3 = 8`). EAX becomes 8, and CF is 0.',
    points: 300,
    estimatedSeconds: 35,
    tags: ['asm', 'bts', 'flags', 'carry_flag']
  },
  {
    id: 'asm-exp-010',
    language: 'asm',
    difficulty: 'expert',
    type: 'multiple_choice',
    topic: 'reverse_engineering',
    subtopic: 'software_breakpoints_int3',
    standardVersion: 'Debugger Mechanics',
    prompt: 'How do standard debuggers (like GDB, x64dbg, WinDbg) set a software breakpoint at a target instruction address in memory?',
    code: `; Debugger breakpoint insertion`,
    options: [
      'Overwrites the first byte of the target instruction with opcode 0xCC (INT 3), catching the SIGTRAP exception and restoring the original byte when hit',
      'Inserts a hardware ring-0 interrupt trap directly into the CPU microcode',
      'Modifies the page table to mark the target memory address as non-readable',
      'Spawns a background thread polling the RIP register every microsecond'
    ],
    correctAnswer: 'Overwrites the first byte of the target instruction with opcode 0xCC (INT 3), catching the SIGTRAP exception and restoring the original byte when hit',
    acceptedAnswers: ['Overwrites the first byte of the target instruction with opcode 0xCC (INT 3), catching the SIGTRAP exception and restoring the original byte when hit'],
    hint: '0xCC is the single-byte INT 3 instruction dedicated specifically to debuggers.',
    explanation: 'To set a software breakpoint, debuggers save the original byte at the target address and overwrite it with `0xCC` (`INT 3`). When the CPU reaches this byte, it generates a breakpoint trap exception (SIGTRAP on POSIX, EXCEPTION_BREAKPOINT on Windows). The debugger catches the signal, restores the original byte, and presents control to the user.',
    points: 300,
    estimatedSeconds: 40,
    tags: ['re', 'debugger', 'int3', 'software_breakpoint']
  },
  {
    id: 'asm-exp-011',
    language: 'asm',
    difficulty: 'expert',
    type: 'multiple_choice',
    topic: 'reverse_engineering',
    subtopic: 'hardware_breakpoints_dr',
    standardVersion: 'x86 Debug Registers',
    prompt: 'How many hardware breakpoints can be simultaneously active on an x86 processor using the DR0-DR3 debug registers?',
    code: `DR0, DR1, DR2, DR3, DR6, DR7`,
    options: [
      'Exactly 4 hardware breakpoints (using DR0 through DR3)',
      '16 hardware breakpoints',
      'Unlimited hardware breakpoints',
      'Only 1 hardware breakpoint'
    ],
    correctAnswer: 'Exactly 4 hardware breakpoints (using DR0 through DR3)',
    acceptedAnswers: ['Exactly 4 hardware breakpoints (using DR0 through DR3)', '4'],
    hint: 'x86 processors provide four dedicated address registers DR0, DR1, DR2, and DR3.',
    explanation: 'The x86 architecture includes four hardware debug registers: `DR0`, `DR1`, `DR2`, and `DR3`, each capable of storing a linear memory address. `DR7` configures condition triggers (execute, write-only, or read/write) and length (1, 2, 4, or 8 bytes). Hence at most 4 hardware breakpoints can be active concurrently.',
    points: 300,
    estimatedSeconds: 35,
    tags: ['re', 'hardware_breakpoints', 'debug_registers', 'dr0_dr3']
  },
  {
    id: 'asm-exp-012',
    language: 'asm',
    difficulty: 'expert',
    type: 'multiple_choice',
    topic: 'security',
    subtopic: 'ret2libc_technique',
    standardVersion: 'Exploitation Concepts',
    prompt: 'What is the classic "ret2libc" exploitation technique on systems with non-executable stack (NX/DEP)?',
    code: `// NX is enabled (stack is not executable)`,
    options: [
      'Subverting execution flow to existing standard C library functions (like `system()`) with controlled stack arguments instead of injecting custom shellcode',
      'Injecting dynamic libraries into the kernel space via `/dev/kmem`',
      'Rewriting libc.so on disk before execution',
      'Overriding the glibc malloc hooks in read-only memory'
    ],
    correctAnswer: 'Subverting execution flow to existing standard C library functions (like `system()`) with controlled stack arguments instead of injecting custom shellcode',
    acceptedAnswers: ['Subverting execution flow to existing standard C library functions (like `system()`) with controlled stack arguments instead of injecting custom shellcode'],
    hint: 'If you cannot execute injected shellcode on the stack, reuse functions already mapped in memory.',
    explanation: 'The ret2libc (return-to-libc) technique bypasses Non-Executable Stack (NX/DEP) protections by overwriting the saved return address with the address of a standard library function like `system("/bin/sh")`. Because libc is mapped with execute permissions, no custom shellcode execution is required.',
    points: 300,
    estimatedSeconds: 40,
    tags: ['re', 'ret2libc', 'security', 'nx_bypass']
  },
  {
    id: 'asm-exp-013',
    language: 'asm',
    difficulty: 'expert',
    type: 'predict_output',
    topic: 'instructions',
    subtopic: 'atomic_cmpxchg',
    standardVersion: 'x86-64 Lock & Atomic Primitives',
    prompt: 'In `lock cmpxchg [rdi], rsi`, what happens if the value at `[rdi]` matches RAX?',
    code: `; Assume [rdi] == rax
lock cmpxchg [rdi], rsi`,
    options: [
      'ZF is set to 1, and the value of RSI is written to [rdi]',
      'ZF is set to 0, and [rdi] is loaded into RAX',
      'The CPU raises a General Protection Fault',
      'RAX is swapped with RSI and [rdi] remains untouched'
    ],
    correctAnswer: 'ZF is set to 1, and the value of RSI is written to [rdi]',
    acceptedAnswers: ['ZF is set to 1, and the value of RSI is written to [rdi]'],
    hint: 'CMPXCHG compares dest with accumulator (RAX). If equal, source is stored in dest.',
    explanation: '`cmpxchg dest, src` compares the accumulator (`rax`) with `dest`. If they are equal, the Zero Flag (ZF) is set to 1 and `src` is copied into `dest`. If unequal, ZF is cleared to 0 and `dest` is loaded into `rax`. This forms the foundation of atomic compare-and-swap (CAS) lock-free data structures.',
    points: 300,
    estimatedSeconds: 40,
    tags: ['asm', 'cmpxchg', 'atomic', 'concurrency']
  },
  {
    id: 'asm-exp-014',
    language: 'asm',
    difficulty: 'expert',
    type: 'multiple_choice',
    topic: 'reverse_engineering',
    subtopic: 'opaque_predicates',
    standardVersion: 'Obfuscation Techniques',
    prompt: 'In binary code obfuscation, what is an "opaque predicate"?',
    code: `xor eax, eax
test eax, eax
jz .always_taken   ; Condition is statically known to author but disguised`,
    options: [
      'A conditional expression whose outcome is always known at compile time to the author, but requires complex analysis for a reverse engineer or decompiler to evaluate',
      'A cryptographic signature embedded inside an ELF section header',
      'A floating point rounding mode flag',
      'An encrypted jump table entry'
    ],
    correctAnswer: 'A conditional expression whose outcome is always known at compile time to the author, but requires complex analysis for a reverse engineer or decompiler to evaluate',
    acceptedAnswers: ['A conditional expression whose outcome is always known at compile time to the author, but requires complex analysis for a reverse engineer or decompiler to evaluate'],
    hint: 'It forces decompilers into generating dead code paths and confuses control-flow graphs.',
    explanation: 'An opaque predicate is an obfuscation technique inserting a conditional branch whose outcome is deterministic at compile time (e.g. `(x * (x + 1)) % 2 == 0` is always true for integers), but intentionally complicates static control-flow analysis and generates false dead-code branches in decompilers.',
    points: 300,
    estimatedSeconds: 40,
    tags: ['re', 'obfuscation', 'opaque_predicate', 'control_flow']
  },
  {
    id: 'asm-exp-015',
    language: 'asm',
    difficulty: 'expert',
    type: 'multiple_choice',
    topic: 'reverse_engineering',
    subtopic: 'control_flow_flattening',
    standardVersion: 'Advanced Obfuscation (OLLVM)',
    prompt: 'What structural transformation does Control Flow Flattening (CFF) perform on a function\'s Control Flow Graph (CFG)?',
    code: `// OLLVM Control Flow Flattening pattern`,
    options: [
      'Breaks basic blocks into cases inside a single giant `switch` statement enclosed in an infinite loop governed by a state variable',
      'Converts all recursive calls into Tail Call Optimization loops',
      'Flattens all multi-dimensional arrays into flat 1D byte pointers',
      'Replaces all function calls with software interrupt handlers'
    ],
    correctAnswer: 'Breaks basic blocks into cases inside a single giant `switch` statement enclosed in an infinite loop governed by a state variable',
    acceptedAnswers: ['Breaks basic blocks into cases inside a single giant `switch` statement enclosed in an infinite loop governed by a state variable'],
    hint: 'All original hierarchical loops and conditionals disappear into a single flat central dispatcher switch.',
    explanation: 'Control Flow Flattening (popularized by OLLVM) breaks all basic blocks apart and places them inside a single central `switch` statement enclosed in a `while` loop. A state variable directs which case runs next, destroying high-level loops, `if/else` structures, and call graphs for reverse engineers.',
    points: 300,
    estimatedSeconds: 45,
    tags: ['re', 'obfuscation', 'cff', 'control_flow_flattening']
  },
  {
    id: 'asm-exp-016',
    language: 'asm',
    difficulty: 'expert',
    type: 'predict_output',
    topic: 'instructions',
    subtopic: 'bsf_bsr_bit_scan',
    standardVersion: 'x86-64 Intel Syntax',
    prompt: 'What index is returned in EAX by `bsf eax, edx` when EDX is `0x00000010` (decimal 16)?',
    code: `mov edx, 0x10  ; 00010000 in binary
bsf eax, edx   ; Bit Scan Forward`,
    options: ['4', '16', '1', '0'],
    correctAnswer: '4',
    acceptedAnswers: ['4'],
    hint: 'BSF scans from least significant bit (bit 0) upward to find the first set bit (1).',
    explanation: '`bsf` (Bit Scan Forward) searches the source operand from bit 0 towards bit 31 for the first bit set to 1. In `16` (`00010000b`), bit 4 is the first set bit. EAX receives index 4.',
    points: 300,
    estimatedSeconds: 35,
    tags: ['asm', 'bsf', 'bit_scan', 'bitwise']
  },
  {
    id: 'asm-exp-017',
    language: 'asm',
    difficulty: 'expert',
    type: 'multiple_choice',
    topic: 'security',
    subtopic: 'cfi_shadow_stack',
    standardVersion: 'Hardware Security (Intel CET)',
    prompt: 'How does Intel CET (Control-flow Enforcement Technology) Shadow Stack protect return addresses from stack-smashing attacks?',
    code: `; Intel CET Shadow Stack`,
    options: [
      'Maintains an isolated, hardware-protected secondary stack where CALL pushes the return address and RET verifies that both stacks match before returning',
      'Encrypts each stack frame with a key derived from CPU temperature',
      'Disables execution of all third-party DLLs',
      'Converts all stack variables to heap allocations'
    ],
    correctAnswer: 'Maintains an isolated, hardware-protected secondary stack where CALL pushes the return address and RET verifies that both stacks match before returning',
    acceptedAnswers: ['Maintains an isolated, hardware-protected secondary stack where CALL pushes the return address and RET verifies that both stacks match before returning'],
    hint: 'Even if an attacker corrupts the normal stack, the shadow stack is inaccessible to user writes.',
    explanation: 'Intel CET Shadow Stack maintains a second hardware-managed stack accessible only to the CPU. During `CALL`, the return address is pushed to both the data stack and the shadow stack. During `RET`, the CPU compares both return addresses; if they differ (indicating stack corruption or ROP), a control protection exception (`#CP`) is triggered immediately.',
    points: 300,
    estimatedSeconds: 45,
    tags: ['re', 'security', 'intel_cet', 'shadow_stack', 'rop_mitigation']
  },
  {
    id: 'asm-exp-018',
    language: 'asm',
    difficulty: 'expert',
    type: 'multiple_choice',
    topic: 'reverse_engineering',
    subtopic: 'import_address_table_hooking',
    standardVersion: 'Windows PE Internals',
    prompt: 'In Windows reverse engineering, what is IAT (Import Address Table) hooking?',
    code: `; Overwriting function pointer inside PE IAT`,
    options: [
      'Overwriting an entry in the executable\'s Import Address Table with the address of a hook function to intercept API calls made by the module',
      'Injecting code into the Windows kernel system service descriptor table (SSDT)',
      'Modifying the DOS header magic bytes `MZ`',
      'Changing the compiler optimization flag at runtime'
    ],
    correctAnswer: 'Overwriting an entry in the executable\'s Import Address Table with the address of a hook function to intercept API calls made by the module',
    acceptedAnswers: ['Overwriting an entry in the executable\'s Import Address Table with the address of a hook function to intercept API calls made by the module'],
    hint: 'Calls to imported APIs like MessageBoxA indirect through the IAT pointer array.',
    explanation: 'In Windows PE binaries, external DLL calls are resolved through pointers in the Import Address Table (IAT). IAT hooking modifies the memory protection of the IAT page (via `VirtualProtect`) and replaces the pointer to an API (e.g. `CreateFileW`) with a custom hook handler, redirecting all calls through the hook.',
    points: 300,
    estimatedSeconds: 40,
    tags: ['re', 'windows', 'pe', 'iat_hooking']
  },
  {
    id: 'asm-exp-019',
    language: 'asm',
    difficulty: 'expert',
    type: 'predict_output',
    topic: 'instructions',
    subtopic: 'xadd_atomic_fetch_and_add',
    standardVersion: 'x86-64 Intel Syntax',
    prompt: 'What values are in EAX and EBX after executing `xadd eax, ebx`?',
    code: `mov eax, 10
mov ebx, 5
xadd eax, ebx`,
    options: ['EAX = 15, EBX = 10', 'EAX = 15, EBX = 5', 'EAX = 5, EBX = 15', 'EAX = 10, EBX = 15'],
    correctAnswer: 'EAX = 15, EBX = 10',
    acceptedAnswers: ['EAX = 15, EBX = 10'],
    hint: 'XADD swaps the source with destination, then stores the sum in destination: like an atomic fetch-and-add.',
    explanation: 'The `xadd dest, src` instruction exchanges the original value of `dest` into `src`, and then adds the original values together and stores the sum in `dest`. Here, `ebx` receives the original value of `eax` (10), and `eax` receives the sum (`10 + 5 = 15`).',
    points: 300,
    estimatedSeconds: 35,
    tags: ['asm', 'xadd', 'atomic', 'registers']
  },
  {
    id: 'asm-exp-020',
    language: 'asm',
    difficulty: 'expert',
    type: 'multiple_choice',
    topic: 'reverse_engineering',
    subtopic: 'smc_self_modifying_code',
    standardVersion: 'Binary Analysis Concepts',
    prompt: 'What is Self-Modifying Code (SMC), and why does it break naive linear disassembly in tools?',
    code: `; Self-Modifying Code loop:
.decrypt_loop:
  xor byte ptr [rsi], 0x5A
  inc rsi
  loop .decrypt_loop
  jmp .now_decrypted_payload`,
    options: [
      'Code that modifies its own instruction opcodes in memory at runtime (e.g. packers/decryptors), causing static linear disassemblers to misinterpret encrypted bytes as valid code',
      'Code that changes the hardware CPU frequency',
      'Code that requires compilation on the target machine without bytecode',
      'Code that only runs inside a browser sandbox'
    ],
    correctAnswer: 'Code that modifies its own instruction opcodes in memory at runtime (e.g. packers/decryptors), causing static linear disassemblers to misinterpret encrypted bytes as valid code',
    acceptedAnswers: ['Code that modifies its own instruction opcodes in memory at runtime (e.g. packers/decryptors), causing static linear disassemblers to misinterpret encrypted bytes as valid code'],
    hint: 'Packers like UPX or custom malware protectors decrypt real opcodes in memory right before jumping to them.',
    explanation: 'Self-Modifying Code (SMC) rewrites instruction bytes in memory during execution (common in packers, protectors, and JIT compilers). Static linear-sweep disassemblers parse the raw bytes before execution, seeing only encrypted or garbage bytes rather than the actual machine code that executes at runtime.',
    points: 300,
    estimatedSeconds: 45,
    tags: ['re', 'smc', 'packers', 'obfuscation']
  }
];

// Verify count
if (CAMPAIGN_QUESTIONS.length !== 60) {
  throw new Error(`Expected exactly 60 campaign questions, got ${CAMPAIGN_QUESTIONS.length}`);
}

// Write data/asm-questions.js
const asmFilePath = path.join(projectRoot, 'data', 'asm-questions.js');
const fileContent = `/**
 * Assembly & Reverse Engineering Curriculum Track
 * 60 Hand-Crafted Pedagogical Questions
 * Distributed across Beginner (20), Intermediate (20), and Expert (20)
 * Source of truth: docs/QUESTION_SCHEMA.md
 */

export const asmQuestions = ${JSON.stringify(CAMPAIGN_QUESTIONS, null, 2)};
`;

fs.writeFileSync(asmFilePath, fileContent, 'utf8');
console.log(`Successfully generated ${asmFilePath} (60 questions).`);

// ============================================================================
// 200 ENDLESS QUESTIONS GENERATION
// ============================================================================
const ENDLESS_TOPICS = [
  {
    topic: 'register_arithmetic_math',
    subtopic: 'add_and_sub',
    prompt: 'What is the decimal value of EAX after this instruction sequence?',
    getCode: (i) => `mov eax, ${i * 7}\nadd eax, ${(i % 10) + 5}\nsub eax, ${i % 4}`,
    ans: (i) => String((i * 7) + ((i % 10) + 5) - (i % 4))
  },
  {
    topic: 'lea_effective_address',
    subtopic: 'scale_index_base',
    prompt: 'What is the computed value loaded into EAX by this LEA instruction?',
    getCode: (i) => `mov ecx, ${i}\nlea eax, [ecx*4 + ${i * 2 + 10}]`,
    ans: (i) => String((i * 4) + (i * 2 + 10))
  },
  {
    topic: 'shift_multiplication',
    subtopic: 'shl_calculation',
    prompt: 'What is the decimal value of EAX after shifting left?',
    getCode: (i) => `mov eax, ${i % 15 + 1}\nshl eax, ${(i % 3) + 1}`,
    ans: (i) => String((i % 15 + 1) << ((i % 3) + 1))
  },
  {
    topic: 'xor_logic',
    subtopic: 'bitwise_xor',
    prompt: 'What is the decimal value of EAX after bitwise XOR?',
    getCode: (i) => `mov eax, ${(i * 3) & 0xFF}\nxor eax, 0x0F`,
    ans: (i) => String(((i * 3) & 0xFF) ^ 0x0F)
  },
  {
    topic: 'stack_offset_calculation',
    subtopic: 'rsp_growth',
    prompt: 'If RSP starts at 0x7FFF0000, what is RSP after pushing N 64-bit registers?',
    getCode: (i) => `; RSP = 0x7FFF0000\n; ${((i % 5) + 1)} sequential 'push rax' instructions`,
    ans: (i) => `0x${(0x7FFF0000 - ((i % 5) + 1) * 8).toString(16).toUpperCase()}`
  },
  {
    topic: 'two_complement_neg',
    subtopic: 'neg_arithmetic',
    prompt: 'What decimal signed value is in EAX after NEG?',
    getCode: (i) => `mov eax, ${i * 10 + 2}\nneg eax`,
    ans: (i) => String(-(i * 10 + 2))
  },
  {
    topic: 'imul_math',
    subtopic: 'multiply_immediate',
    prompt: 'What is the decimal value of EAX after IMUL?',
    getCode: (i) => `mov eax, ${(i % 12) + 2}\nimul eax, 9`,
    ans: (i) => String(((i % 12) + 2) * 9)
  },
  {
    topic: 'inc_dec_flow',
    subtopic: 'register_counters',
    prompt: 'What is the final value of EAX?',
    getCode: (i) => `mov eax, ${i * 5}\ninc eax\ninc eax\ndec eax`,
    ans: (i) => String((i * 5) + 1)
  }
];

const endlessASM = [];
for (let i = 1; i <= 200; i++) {
  const diff = i <= 70 ? 'beginner' : (i <= 140 ? 'intermediate' : 'expert');
  const points = diff === 'beginner' ? 100 : (diff === 'intermediate' ? 200 : 300);
  const tmpl = ENDLESS_TOPICS[(i - 1) % ENDLESS_TOPICS.length];
  const correct = tmpl.ans(i);
  
  const alt1 = tmpl.ans(i + 1);
  const alt2 = tmpl.ans(i + 2);
  const alt3 = String(Number(correct) + 10 || 0);
  const opts = Array.from(new Set([correct, alt1, alt2, alt3])).slice(0, 4);
  while (opts.length < 4) opts.push(`0x${(i * 16 + opts.length).toString(16)}`);

  endlessASM.push({
    id: `asm-end-${pad(i)}`,
    language: 'asm',
    difficulty: diff,
    type: 'predict_output',
    topic: tmpl.topic,
    subtopic: tmpl.subtopic,
    standardVersion: 'x86-64 / Reverse Engineering',
    prompt: tmpl.prompt,
    code: tmpl.getCode(i),
    options: opts,
    correctAnswer: correct,
    acceptedAnswers: [correct],
    hint: `Simulate the instruction according to x86-64 CPU architectural state rules.`,
    explanation: `Executing these instructions calculates ${correct} in the target register.`,
    points: points,
    estimatedSeconds: 30,
    tags: ['asm', 'x86_64', tmpl.topic, 'endless']
  });
}

// Update data/endless-questions.js
const endlessFilePath = path.join(projectRoot, 'data', 'endless-questions.js');
let endlessCode = fs.readFileSync(endlessFilePath, 'utf8');

if (endlessCode.includes('asm:')) {
  console.log('ASM already exists in endless-questions.js, skipping append.');
} else {
  const insertIndex = endlessCode.lastIndexOf('};');
  if (insertIndex !== -1) {
    const asmJson = JSON.stringify(endlessASM, null, 2);
    const updated = endlessCode.slice(0, insertIndex) + `,\n  asm: ${asmJson}\n` + endlessCode.slice(insertIndex);
    fs.writeFileSync(endlessFilePath, updated, 'utf8');
    console.log(`Successfully added 200 endless questions for ASM into ${endlessFilePath}.`);
  }
}
