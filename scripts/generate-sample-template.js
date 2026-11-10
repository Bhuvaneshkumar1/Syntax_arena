import fs from 'fs';

const beginnerQs = [];
for (let i = 1; i <= 20; i++) {
  beginnerQs.push({
    id: `cust-go-beg-${String(i).padStart(3, '0')}`,
    language: 'go',
    difficulty: 'beginner',
    type: 'predict_output',
    prompt: `[Lesson Drill ${i}] What is the output of this Go initialization snippet?`,
    code: `package main\nimport "fmt"\n\nfunc main() {\n    x := ${i * 5}\n    y := x + 10\n    fmt.Println(y)\n}`,
    options: [`${i * 5 + 10}`, `${i * 5}`, '0', 'compile error'],
    correctIndex: 0,
    explanation: `Short variable declaration initializes x to ${i * 5}, then y evaluates to ${i * 5 + 10}.`,
    hint: 'Check the := declaration and arithmetic addition.'
  });
}

const intermediateQs = [];
for (let i = 1; i <= 20; i++) {
  intermediateQs.push({
    id: `cust-go-int-${String(i).padStart(3, '0')}`,
    language: 'go',
    difficulty: 'intermediate',
    type: 'predict_output',
    prompt: `[Lesson Drill ${i}] What does this buffered channel operation output?`,
    code: `package main\nimport "fmt"\n\nfunc main() {\n    ch := make(chan int, 2)\n    ch <- ${i * 2}\n    ch <- ${i * 2 + 1}\n    fmt.Println(<-ch)\n}`,
    options: [`${i * 2}`, `${i * 2 + 1}`, 'deadlock', 'nil'],
    correctIndex: 0,
    explanation: 'Channels are FIFO queues. The first value sent is the first value received.',
    hint: 'Remember channels operate in First-In, First-Out (FIFO) sequence.'
  });
}

const expertQs = [];
for (let i = 1; i <= 20; i++) {
  expertQs.push({
    id: `cust-go-exp-${String(i).padStart(3, '0')}`,
    language: 'go',
    difficulty: 'expert',
    type: 'predict_output',
    prompt: `[Lesson Drill ${i}] What is printed by this select multiplexer with default case?`,
    code: `package main\nimport "fmt"\n\nfunc main() {\n    ch := make(chan string, 1)\n    select {\n    case msg := <-ch:\n        fmt.Println(msg)\n    default:\n        fmt.Println("non-blocking-${i}")\n    }\n}`,
    options: [`non-blocking-${i}`, 'deadlock', 'nil', '""'],
    correctIndex: 0,
    explanation: 'Since the channel buffer is empty and no sender is ready, the select default case executes immediately without blocking.',
    hint: 'A select statement with a default case never blocks.'
  });
}

const samplePack = {
  lessonMetadata: {
    id: 'cust-les-go-01',
    title: 'Go CSP Concurrency & Channel Primitives',
    language: 'go',
    difficulty: 'intermediate',
    estimatedMinutes: 8,
    tagline: 'Master goroutines, buffered channels, select multiplexing, and deadlock prevention.'
  },
  cyberAcademy: {
    id: 'cust-les-go-01',
    language: 'go',
    difficulty: 'intermediate',
    topic: 'Goroutines & CSP Concurrency',
    title: 'Chapter 1: Communicating Sequential Processes (CSP) in Go',
    tagline: 'Do not communicate by sharing memory; instead, share memory by communicating.',
    estimatedMinutes: 8,
    objectives: [
      'Differentiate between OS threads and M:N multiplexed goroutines',
      'Understand unbuffered vs buffered channel synchronization semantics',
      'Multiplex I/O channels cleanly using non-blocking select statements',
      'Prevent goroutine leaks and synchronization deadlocks'
    ],
    chapterSummary: 'Go implements Tony Hoares Communicating Sequential Processes (CSP) paradigm. Instead of guarding shared mutable state with complex mutex locks, Go encourages passing ownership of data through typed channels.',
    deepDive: {
      title: 'Go Runtime M:N Scheduler & Work Stealing',
      content: 'The Go runtime schedules thousands of lightweight goroutines (G) across logical processors (P) and OS threads (M). When a goroutine blocks on a network call or channel operation, the scheduler parks G and steals work from other queues to keep CPU cores 100% saturated.',
      codeSnippet: 'package main\nimport (\n    "fmt"\n    "sync"\n)\nfunc main() {\n    var wg sync.WaitGroup\n    wg.Add(1)\n    go func() {\n        defer wg.Done()\n        fmt.Println("Async worker finished")\n    }()\n    wg.Wait()\n}'
    },
    takeaways: [
      'Goroutines begin with a tiny 2KB stack that grows dynamically as needed.',
      'Sending to an unbuffered channel blocks until a receiver is ready.',
      'Closing a closed channel panics; always close from the sender side.',
      'Use select with a default case to execute non-blocking channel polling.'
    ],
    slides: [
      {
        type: 'concept',
        badge: '01 // MENTAL MODEL',
        title: 'Goroutines & Channels: The Pipe Model',
        content: 'Channels are synchronization conduits. When goroutines send and receive on an unbuffered channel, they perform an atomic handshake where data is handed off directly between memory stacks.',
        codeSnippet: 'ch := make(chan int)\ngo func() {\n    ch <- 42 // Blocks until main receives\n}()\nval := <-ch // Handshake completes\nfmt.Println(val)',
        sandboxCode: 'package main\nimport "fmt"\nfunc main() {\n    ch := make(chan string, 1)\n    ch <- "Hello from channel"\n    fmt.Println(<-ch)\n}'
      },
      {
        type: 'drill',
        badge: '02 // INTERACTIVE CHECKPOINT',
        title: 'FIFO Channel Ordering',
        prompt: 'A buffered channel of capacity 2 receives 10 and then 20. What does <-ch return first?',
        codeSnippet: 'ch := make(chan int, 2)\nch <- 10\nch <- 20\nfmt.Println(<-ch)',
        options: [
          { text: '10', isCorrect: true, feedback: '🎯 Correct! Go channels strictly maintain First-In, First-Out (FIFO) queue order.' },
          { text: '20', isCorrect: false, feedback: 'Incorrect. Channels are queues (FIFO), not stacks (LIFO).' },
          { text: '30', isCorrect: false, feedback: 'Incorrect. Channel reads return individual elements.' },
          { text: 'deadlock', isCorrect: false, feedback: 'Incorrect. The buffer has capacity 2, so writes do not block.' }
        ]
      },
      {
        type: 'pitfall',
        badge: '03 // DANGER ZONE',
        title: 'Unbuffered Channel Self-Deadlock',
        content: 'Sending to an unbuffered channel in the main goroutine without an active concurrent receiver causes an immediate fatal deadlock panic.',
        badCode: 'func main() {\n    ch := make(chan int)\n    ch <- 1 // Fatal error: all goroutines are asleep - deadlock!\n    fmt.Println(<-ch)\n}',
        goodCode: 'func main() {\n    ch := make(chan int, 1) // Buffered capacity of 1 avoids block\n    ch <- 1\n    fmt.Println(<-ch)\n}'
      }
    ]
  },
  questions: [...beginnerQs, ...intermediateQs, ...expertQs]
};

fs.writeFileSync('data/sample-lesson-template.json', JSON.stringify(samplePack, null, 2), 'utf8');
console.log('Sample lesson template successfully written to data/sample-lesson-template.json (Questions:', samplePack.questions.length, ')');

