/**
 * SyntaxArena Tactile Memory Pointer Minigames Catalog (Feature 8)
 * Datasets for:
 * 1. Cable Connect ("Stack Master") - Drag-and-drop pointer wire routing
 * 2. Leak Patrol ("Heap Hunter") - Mark-and-sweep garbage collection & orphan deallocation
 * 3. Dereference Rush ("Segfault Defuser") - Rapid-fire memory hazard triage
 * Zero external dependencies.
 */

export const CABLE_CONNECT_LEVELS = [
  {
    id: 'cc_01_single_ptr',
    title: 'Direct Integer Pointer',
    difficulty: 'Beginner',
    language: 'C',
    codeSnippet: `int *ptr = (int*)malloc(sizeof(int));\n*ptr = 42;`,
    explanation: '`ptr` is a local pointer residing on the stack frame that holds the hex address of a 4-byte heap integer block.',
    xpReward: 120,
    stack: [
      { id: 'stk_ptr', name: 'ptr', type: 'int*', address: '0x7ffd08', isPointer: true, slot: 'port-out' },
      { id: 'stk_dummy', name: 'argc', type: 'int', address: '0x7ffd10', isPointer: false, value: '1' }
    ],
    heap: [
      { id: 'hp_val42', address: '0x55a100', size: '4B', type: 'int', value: '42', label: 'malloc(sizeof(int))', slot: 'port-in' },
      { id: 'hp_decoy', address: '0x55a140', size: '4B', type: 'int', value: '0', label: 'Unrelated chunk', slot: 'port-in' }
    ],
    requiredConnections: [
      { from: 'stk_ptr', to: 'hp_val42' }
    ]
  },
  {
    id: 'cc_02_pointer_aliasing',
    title: 'Pointer Aliasing & Reassignment',
    difficulty: 'Beginner',
    language: 'C',
    codeSnippet: `int *p = (int*)malloc(sizeof(int));\nint *q = (int*)malloc(sizeof(int));\np = q; // p now aliases q's target!`,
    explanation: 'After `p = q`, both pointer variables point directly to the same heap block at address `0x55a240`.',
    xpReward: 160,
    stack: [
      { id: 'stk_p', name: 'p', type: 'int*', address: '0x7ffd00', isPointer: true, slot: 'port-out' },
      { id: 'stk_q', name: 'q', type: 'int*', address: '0x7ffd08', isPointer: true, slot: 'port-out' }
    ],
    heap: [
      { id: 'hp_target_q', address: '0x55a240', size: '4B', type: 'int', value: '100', label: 'Block Q', slot: 'port-in' },
      { id: 'hp_orphaned_p', address: '0x55a200', size: '4B', type: 'int', value: '50', label: 'Leaked Block P', slot: 'port-in' }
    ],
    requiredConnections: [
      { from: 'stk_p', to: 'hp_target_q' },
      { from: 'stk_q', to: 'hp_target_q' }
    ]
  },
  {
    id: 'cc_03_ptr_to_ptr',
    title: 'Pointer to Pointer (Double Indirection)',
    difficulty: 'Intermediate',
    language: 'C',
    codeSnippet: `int val = 99;\nint *p = &val;\nint **pp = &p;\nint *heap_val = (int*)malloc(sizeof(int));`,
    explanation: '`pp` holds the address of stack pointer `p`, while `heap_val` holds the address of the dynamic integer block on the heap.',
    xpReward: 200,
    stack: [
      { id: 'stk_val', name: 'val', type: 'int', address: '0x7ffcf8', isPointer: false, value: '99', slot: 'port-in' },
      { id: 'stk_p', name: 'p', type: 'int*', address: '0x7ffd00', isPointer: true, slot: 'port-both' },
      { id: 'stk_pp', name: 'pp', type: 'int**', address: '0x7ffd08', isPointer: true, slot: 'port-out' },
      { id: 'stk_hptr', name: 'heap_val', type: 'int*', address: '0x7ffd10', isPointer: true, slot: 'port-out' }
    ],
    heap: [
      { id: 'hp_int99', address: '0x55a300', size: '4B', type: 'int', value: '99', label: 'Heap Int', slot: 'port-in' }
    ],
    requiredConnections: [
      { from: 'stk_pp', to: 'stk_p' },
      { from: 'stk_p', to: 'stk_val' },
      { from: 'stk_hptr', to: 'hp_int99' }
    ]
  },
  {
    id: 'cc_04_linked_list',
    title: 'Singly Linked List Chain',
    difficulty: 'Intermediate',
    language: 'C',
    codeSnippet: `struct Node {\n  int data;\n  struct Node *next;\n};\nstruct Node *head = malloc(sizeof(struct Node));\nhead->next = malloc(sizeof(struct Node));\nhead->next->next = NULL;`,
    explanation: '`head` points to Node A on the heap (`0x55a400`), and Node A\'s `next` pointer routes forward to Node B (`0x55a430`).',
    xpReward: 240,
    stack: [
      { id: 'stk_head', name: 'head', type: 'Node*', address: '0x7ffd00', isPointer: true, slot: 'port-out' }
    ],
    heap: [
      { id: 'hp_node_a', address: '0x55a400', size: '16B', type: 'Node', value: 'data: 10', label: 'Node A [head]', slot: 'port-both' },
      { id: 'hp_node_b', address: '0x55a430', size: '16B', type: 'Node', value: 'data: 20', label: 'Node B [tail]', slot: 'port-in' },
      { id: 'hp_decoy_node', address: '0x55a460', size: '16B', type: 'Node', value: 'data: 99', label: 'Dangling Node', slot: 'port-in' }
    ],
    requiredConnections: [
      { from: 'stk_head', to: 'hp_node_a' },
      { from: 'hp_node_a', to: 'hp_node_b' }
    ]
  },
  {
    id: 'cc_05_string_array',
    title: 'Dynamic String Vector (char**)',
    difficulty: 'Advanced',
    language: 'C',
    codeSnippet: `char **tokens = malloc(2 * sizeof(char*));\ntokens[0] = strdup("GET");\ntokens[1] = strdup("/api");`,
    explanation: '`tokens` references an array of pointer handles on the heap, which in turn connect to two independent string buffer allocations.',
    xpReward: 280,
    stack: [
      { id: 'stk_tokens', name: 'tokens', type: 'char**', address: '0x7ffd00', isPointer: true, slot: 'port-out' }
    ],
    heap: [
      { id: 'hp_tokens_arr', address: '0x55a500', size: '16B', type: 'char*[2]', value: '[ptr0, ptr1]', label: 'Pointer Table', slot: 'port-both' },
      { id: 'hp_str_get', address: '0x55a540', size: '4B', type: 'char[]', value: '"GET\\0"', label: 'Token 0 Buffer', slot: 'port-in' },
      { id: 'hp_str_api', address: '0x55a560', size: '5B', type: 'char[]', value: '"/api\\0"', label: 'Token 1 Buffer', slot: 'port-in' }
    ],
    requiredConnections: [
      { from: 'stk_tokens', to: 'hp_tokens_arr' },
      { from: 'hp_tokens_arr', to: 'hp_str_get' },
      { from: 'hp_tokens_arr', to: 'hp_str_api' }
    ]
  },
  {
    id: 'cc_06_binary_tree',
    title: 'Binary Search Tree Branching',
    difficulty: 'Advanced',
    language: 'C++',
    codeSnippet: `struct TreeNode {\n  int key;\n  TreeNode *left, *right;\n};\nTreeNode *root = new TreeNode(50);\nroot->left = new TreeNode(25);\nroot->right = new TreeNode(75);`,
    explanation: 'The stack root pointer directs to the root tree node, which branches out to both left and right child heap allocations.',
    xpReward: 320,
    stack: [
      { id: 'stk_root', name: 'root', type: 'TreeNode*', address: '0x7ffd00', isPointer: true, slot: 'port-out' }
    ],
    heap: [
      { id: 'hp_tree_root', address: '0x55a600', size: '24B', type: 'TreeNode', value: 'key: 50', label: 'Root Node (50)', slot: 'port-both' },
      { id: 'hp_tree_left', address: '0x55a630', size: '24B', type: 'TreeNode', value: 'key: 25', label: 'Left Child (25)', slot: 'port-in' },
      { id: 'hp_tree_right', address: '0x55a660', size: '24B', type: 'TreeNode', value: 'key: 75', label: 'Right Child (75)', slot: 'port-in' }
    ],
    requiredConnections: [
      { from: 'stk_root', to: 'hp_tree_root' },
      { from: 'hp_tree_root', to: 'hp_tree_left' },
      { from: 'hp_tree_root', to: 'hp_tree_right' }
    ]
  }
];

export const LEAK_PATROL_LEVELS = [
  {
    id: 'lp_01_reassign_leak',
    title: 'Pointer Overwrite Leak',
    difficulty: 'Beginner',
    language: 'C',
    story: 'A telemetry worker allocated a 128-byte cache chunk, then overwrote the pointer with another malloc without freeing!',
    codeSnippet: `void record_telemetry() {\n  char *buf = malloc(128); // 0x55b100\n  buf = malloc(256);       // 0x55b200 (0x55b100 orphaned!)\n  // ...\n}`,
    initialHeapBytes: 384,
    maxHeapCapacity: 512,
    xpReward: 150,
    stackRoots: [
      { id: 'stk_buf', name: 'buf', address: '0x7ffd00', pointsTo: 'hp_buf_new' }
    ],
    heapBlocks: [
      { id: 'hp_buf_leaked', address: '0x55b100', sizeBytes: 128, label: 'Unreferenced Buffer', type: 'char[128]', incomingRefs: [], isOrphaned: true },
      { id: 'hp_buf_new', address: '0x55b200', sizeBytes: 256, label: 'Active Telemetry Buffer', type: 'char[256]', incomingRefs: ['stk_buf'], isOrphaned: false }
    ],
    orphansToReclaim: ['hp_buf_leaked']
  },
  {
    id: 'lp_02_loop_leak',
    title: 'Loop Allocation Leak',
    difficulty: 'Beginner',
    language: 'C',
    story: 'A batch processor allocated 3 temporary calculation blocks inside a loop, but only retained a handle to the last one.',
    codeSnippet: `int *scratch = NULL;\nfor (int i = 0; i < 3; i++) {\n  scratch = malloc(64);\n}\n// Only final iteration (64B) is reachable! 2 chunks leaked.`,
    initialHeapBytes: 192,
    maxHeapCapacity: 256,
    xpReward: 200,
    stackRoots: [
      { id: 'stk_scratch', name: 'scratch', address: '0x7ffd08', pointsTo: 'hp_loop_3' }
    ],
    heapBlocks: [
      { id: 'hp_loop_1', address: '0x55b300', sizeBytes: 64, label: 'Iteration 0 Scratch', type: 'int[16]', incomingRefs: [], isOrphaned: true },
      { id: 'hp_loop_2', address: '0x55b340', sizeBytes: 64, label: 'Iteration 1 Scratch', type: 'int[16]', incomingRefs: [], isOrphaned: true },
      { id: 'hp_loop_3', address: '0x55b380', sizeBytes: 64, label: 'Iteration 2 Scratch (Active)', type: 'int[16]', incomingRefs: ['stk_scratch'], isOrphaned: false }
    ],
    orphansToReclaim: ['hp_loop_1', 'hp_loop_2']
  },
  {
    id: 'lp_03_severed_list',
    title: 'Severed Linked List Tail',
    difficulty: 'Intermediate',
    language: 'C',
    story: 'A deque queue operation severed a list at node 2 by setting `n2->next = NULL` without traversing and freeing the trailing nodes.',
    codeSnippet: `// Severing list node prematurely:\nNode *n2 = head->next;\nn2->next = NULL; // Trailing node3 & node4 are now floating unreachable!`,
    initialHeapBytes: 320,
    maxHeapCapacity: 400,
    xpReward: 250,
    stackRoots: [
      { id: 'stk_head', name: 'head', address: '0x7ffd00', pointsTo: 'hp_node_1' }
    ],
    heapBlocks: [
      { id: 'hp_node_1', address: '0x55b400', sizeBytes: 32, label: 'Queue Head', type: 'Node', incomingRefs: ['stk_head'], references: ['hp_node_2'], isOrphaned: false },
      { id: 'hp_node_2', address: '0x55b440', sizeBytes: 32, label: 'Queue Mid', type: 'Node', incomingRefs: ['hp_node_1'], references: [], isOrphaned: false },
      { id: 'hp_node_3', address: '0x55b480', sizeBytes: 32, label: 'Orphaned Tail 1', type: 'Node', incomingRefs: [], references: ['hp_node_4'], isOrphaned: true },
      { id: 'hp_node_4', address: '0x55b4c0', sizeBytes: 32, label: 'Orphaned Tail 2', type: 'Node', incomingRefs: ['hp_node_3'], references: [], isOrphaned: true }
    ],
    orphansToReclaim: ['hp_node_3', 'hp_node_4']
  },
  {
    id: 'lp_04_cyclic_island',
    title: 'Cyclic Reference Island',
    difficulty: 'Intermediate',
    language: 'C++',
    story: 'Two worker nodes hold shared pointer handles to each other forming a cyclic loop, but the stack root was dropped!',
    codeSnippet: `struct Peer { Peer *partner; };\n// Peer A -> Peer B and Peer B -> Peer A\n// Stack pointer dropped: root = NULL;\n// Neither can be reached from stack, but their internal ref is > 0!`,
    initialHeapBytes: 512,
    maxHeapCapacity: 640,
    xpReward: 300,
    stackRoots: [
      { id: 'stk_live', name: 'active_session', address: '0x7ffd10', pointsTo: 'hp_live_session' }
    ],
    heapBlocks: [
      { id: 'hp_live_session', address: '0x55b500', sizeBytes: 128, label: 'Active Session Object', type: 'Session', incomingRefs: ['stk_live'], references: [], isOrphaned: false },
      { id: 'hp_peer_a', address: '0x55b600', sizeBytes: 96, label: 'Peer A (Cyclic)', type: 'Peer', incomingRefs: ['hp_peer_b'], references: ['hp_peer_b'], isOrphaned: true },
      { id: 'hp_peer_b', address: '0x55b660', sizeBytes: 96, label: 'Peer B (Cyclic)', type: 'Peer', incomingRefs: ['hp_peer_a'], references: ['hp_peer_a'], isOrphaned: true }
    ],
    orphansToReclaim: ['hp_peer_a', 'hp_peer_b']
  },
  {
    id: 'lp_05_early_return',
    title: 'Error Path Early Return Leak',
    difficulty: 'Advanced',
    language: 'C',
    story: 'An authentication handler allocated an encryption key and a signature buffer. When validation failed, it returned immediately without `free()`!',
    codeSnippet: `int verify_auth(Packet *p) {\n  char *key = malloc(64);\n  char *sig = malloc(128);\n  if (!p->valid) return -1; // LEAK! Neither key nor sig freed!\n  // ...\n}`,
    initialHeapBytes: 448,
    maxHeapCapacity: 512,
    xpReward: 350,
    stackRoots: [
      { id: 'stk_packet', name: 'p', address: '0x7ffd00', pointsTo: 'hp_active_pkt' }
    ],
    heapBlocks: [
      { id: 'hp_active_pkt', address: '0x55b700', sizeBytes: 64, label: 'Incoming Packet', type: 'Packet', incomingRefs: ['stk_packet'], references: [], isOrphaned: false },
      { id: 'hp_leaked_key', address: '0x55b740', sizeBytes: 64, label: 'Unfreed Encryption Key', type: 'char[64]', incomingRefs: [], references: [], isOrphaned: true },
      { id: 'hp_leaked_sig', address: '0x55b780', sizeBytes: 128, label: 'Unfreed RSA Signature', type: 'char[128]', incomingRefs: [], references: [], isOrphaned: true }
    ],
    orphansToReclaim: ['hp_leaked_key', 'hp_leaked_sig']
  }
];

export const DEREFERENCE_RUSH_CHALLENGES = [
  {
    id: 'dr_01',
    code: `int *ptr = NULL;\n*ptr = 42;`,
    category: 'null_dereference',
    explanation: '`ptr` is explicitly initialized to NULL (address 0x0). Dereferencing address 0 triggers a CPU hardware fault (SIGSEGV).'
  },
  {
    id: 'dr_02',
    code: `int val = 100;\nint *ptr = &val;\n*ptr = 200;`,
    category: 'safe_dereference',
    explanation: '`ptr` holds the valid address of stack variable `val`. Writing through `*ptr` safely updates `val` to 200.'
  },
  {
    id: 'dr_03',
    code: `int *p = (int*)malloc(sizeof(int));\nfree(p);\n*p = 10;`,
    category: 'dangling_pointer',
    explanation: 'Memory at `p` was released via `free()`. Accessing it afterwards is a classic Use-After-Free (UAF) dangling pointer defect.'
  },
  {
    id: 'dr_04',
    code: `int arr[5] = {1, 2, 3, 4, 5};\nint val = arr[10];`,
    category: 'out_of_bounds',
    explanation: 'The array has 5 elements (indices 0..4). Index 10 accesses unallocated memory outside the array boundary.'
  },
  {
    id: 'dr_05',
    code: `int *ptr;\n*ptr = 55; // Notice: uninitialized!`,
    category: 'wild_pointer',
    explanation: '`ptr` is an uninitialized local pointer containing arbitrary garbage stack bits (a wild pointer). Dereferencing causes undefined behavior or crash.'
  },
  {
    id: 'dr_06',
    code: `char *str = (char*)malloc(16);\nstrcpy(str, "SyntaxArena");\nprintf("%c\\n", *str);`,
    category: 'safe_dereference',
    explanation: 'Heap buffer of 16 bytes is actively allocated, populated with a valid null-terminated string, and read safely.'
  },
  {
    id: 'dr_07',
    code: `int *p = NULL;\nif (p != NULL) {\n  *p = 10;\n}`,
    category: 'safe_dereference',
    explanation: 'The dereference is guarded behind a NULL check `p != NULL`. The code block never executes, preventing any crash.'
  },
  {
    id: 'dr_08',
    code: `int *p = (int*)malloc(4);\nint *q = p;\nfree(p);\n*q = 99;`,
    category: 'dangling_pointer',
    explanation: '`q` aliased `p`. When `free(p)` was called, `q` was also rendered a dangling pointer. `*q` causes Use-After-Free.'
  },
  {
    id: 'dr_09',
    code: `int* create_num() {\n  int local_val = 77;\n  return &local_val;\n}\nint *p = create_num();\nprintf("%d\\n", *p);`,
    category: 'dangling_pointer',
    explanation: 'Returning the address of a local stack variable causes `p` to point to a destroyed stack frame that has already popped.'
  },
  {
    id: 'dr_10',
    code: `int numbers[3] = {10, 20, 30};\nint *p = numbers + 3;\n*p = 40;`,
    category: 'out_of_bounds',
    explanation: 'Pointer arithmetic `numbers + 3` points one past the end of the 3-element buffer. Dereferencing it writes out of bounds.'
  },
  {
    id: 'dr_11',
    code: `char *s = (char*)calloc(8, sizeof(char));\ns[0] = 'K';\nfree(s);`,
    category: 'safe_dereference',
    explanation: '`calloc` zero-initializes the dynamic buffer, the first byte is safely mutated, and cleanly deallocated at the end.'
  },
  {
    id: 'dr_12',
    code: `struct Node { int val; struct Node* next; };\nstruct Node* head = NULL;\nint x = head->val;`,
    category: 'null_dereference',
    explanation: '`head->val` is equivalent to `(*head).val`. Since `head` is NULL, accessing member `val` triggers a NULL pointer dereference.'
  },
  {
    id: 'dr_13',
    code: `int **pp = NULL;\n**pp = 5;`,
    category: 'null_dereference',
    explanation: 'Double pointer `pp` is NULL. The first dereference `*pp` crashes immediately at address 0 before reaching the second indirection.'
  },
  {
    id: 'dr_14',
    code: `int *p = (int*)malloc(sizeof(int));\n*p = 100;\nfree(p);\np = NULL;\n// no further dereference`,
    category: 'safe_dereference',
    explanation: 'Memory allocated, safely dereferenced, freed, and zeroed out to NULL to prevent dangling pointers. 100% safe memory hygiene.'
  },
  {
    id: 'dr_15',
    code: `char buffer[4];\nstrcpy(buffer, "OverflowingSecretBuffer123");`,
    category: 'out_of_bounds',
    explanation: 'Attempting to copy a 27-byte string into a 4-byte stack buffer smashes the return address and crashes the process.'
  }
];

if (typeof window !== 'undefined') {
  window.CABLE_CONNECT_LEVELS = CABLE_CONNECT_LEVELS;
  window.LEAK_PATROL_LEVELS = LEAK_PATROL_LEVELS;
  window.DEREFERENCE_RUSH_CHALLENGES = DEREFERENCE_RUSH_CHALLENGES;
}

