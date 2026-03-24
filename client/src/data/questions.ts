import type { TopicQuestion, CodingPrompt, FollowUp } from "@shared/schema";

export const topicQuestions: TopicQuestion[] = [
  // === COLLECTIONS ===
  {
    id: "tq-col-1",
    topic: "Collections",
    difficulty: "Easy",
    question: "What is the difference between ArrayList and LinkedList? When would you choose one over the other?",
    keyPoints: ["Array-based vs node-based", "O(1) random access vs O(n)", "Insertion/deletion performance", "Memory overhead"],
    sampleAnswer: "ArrayList uses a dynamic array internally, providing O(1) random access but O(n) insertion/deletion in the middle. LinkedList uses doubly-linked nodes, offering O(1) insertion/deletion at known positions but O(n) access. Choose ArrayList for read-heavy workloads and LinkedList when frequent insertions/removals at arbitrary positions are needed. In practice, ArrayList is preferred 95% of the time due to CPU cache locality.",
  },
  {
    id: "tq-col-2",
    topic: "Collections",
    difficulty: "Medium",
    question: "How does HashMap work internally? Explain the hashing, bucket structure, and what happens during collisions.",
    keyPoints: ["hashCode() and indexFor", "Bucket array of linked lists / trees", "Treeification at threshold 8", "Load factor and rehashing"],
    sampleAnswer: "HashMap stores entries in an array of buckets. When you put a key-value pair, it computes hashCode(), spreads it via (h ^ h>>>16), then masks with (capacity-1) to find the bucket index. Collisions are handled via linked lists; since Java 8, if a bucket exceeds 8 entries, it converts to a red-black tree (O(log n) lookup). The default load factor is 0.75 — when size exceeds capacity * loadFactor, the array doubles and all entries are rehashed. Keys must correctly implement hashCode() and equals().",
  },
  {
    id: "tq-col-3",
    topic: "Collections",
    difficulty: "Medium",
    question: "Explain ConcurrentHashMap and how it differs from synchronized HashMap or Hashtable.",
    keyPoints: ["Segment-based locking (pre-Java 8)", "CAS + synchronized per-bucket (Java 8+)", "No null keys/values", "Weakly consistent iterators"],
    sampleAnswer: "ConcurrentHashMap uses fine-grained locking. Since Java 8, it uses CAS operations for bucket initialization and synchronized blocks on individual bucket heads, allowing concurrent reads without locking and concurrent writes on different buckets. Unlike Collections.synchronizedMap which locks the entire map for every operation, ConcurrentHashMap offers much better throughput. Iterators are weakly consistent — they reflect the state at the time of creation and may or may not see subsequent updates. Null keys and values are not allowed.",
  },
  {
    id: "tq-col-4",
    topic: "Collections",
    difficulty: "Hard",
    question: "What is the difference between fail-fast and fail-safe iterators? Give examples of each.",
    keyPoints: ["ConcurrentModificationException", "modCount tracking", "Snapshot/weakly-consistent iterators", "CopyOnWriteArrayList, ConcurrentHashMap"],
    sampleAnswer: "Fail-fast iterators (ArrayList, HashMap) throw ConcurrentModificationException if the collection is structurally modified during iteration, detected via an internal modCount field. Fail-safe iterators work on a copy or use weak consistency — CopyOnWriteArrayList iterates over a snapshot of the array, while ConcurrentHashMap's iterators reflect the state at creation time. Fail-safe iterators don't throw exceptions but may not reflect the latest changes.",
  },
  {
    id: "tq-col-5",
    topic: "Collections",
    difficulty: "Easy",
    question: "What is the difference between HashSet, LinkedHashSet, and TreeSet? When would you use each?",
    keyPoints: ["Ordering guarantees", "Underlying data structures", "Time complexity differences", "Null handling"],
    sampleAnswer: "HashSet uses a HashMap internally — O(1) average for add/remove/contains with no ordering guarantee. LinkedHashSet maintains insertion order via a doubly-linked list on top of the HashMap — slightly more memory but predictable iteration. TreeSet uses a Red-Black Tree, maintaining natural or custom (Comparator) sort order with O(log n) operations. Use HashSet for fast membership checks with no ordering need; LinkedHashSet when insertion order matters; TreeSet for sorted iteration, range queries (headSet, tailSet), or when you need ceiling/floor element lookups.",
  },
  {
    id: "tq-col-6",
    topic: "Collections",
    difficulty: "Medium",
    question: "How does PriorityQueue work in Java? What are its time complexities and limitations in concurrent environments?",
    keyPoints: ["Min-heap backed by array", "O(log n) offer/poll, O(1) peek", "Not thread-safe", "PriorityBlockingQueue for concurrency"],
    sampleAnswer: "PriorityQueue is backed by a binary min-heap stored in an array. offer() and poll() are O(log n) due to sift-up/sift-down operations; peek() is O(1) since the minimum is always at index 0. The natural ordering is used unless a Comparator is supplied. Limitations: it's not thread-safe and does not support null elements. For concurrent use, PriorityBlockingQueue provides the same heap semantics with blocking take() and put() operations. Note that PriorityQueue's iterator does NOT guarantee traversal in sorted order — use repeated poll() for sorted output.",
  },
  {
    id: "tq-col-7",
    topic: "Collections",
    difficulty: "Hard",
    question: "Explain the internal resizing mechanism of ArrayList. How does amortized O(1) insertion work?",
    keyPoints: ["1.5x growth factor", "System.arraycopy cost", "Amortized analysis", "ensureCapacity optimization"],
    sampleAnswer: "ArrayList's internal array grows by 50% (newCapacity = oldCapacity + oldCapacity >> 1) when full. Although a single add() that triggers resizing costs O(n) due to System.arraycopy, the amortized cost per element is O(1). By doubling (approximately), each element is copied on average only a constant number of times across all insertions. For bulk inserts, calling ensureCapacity() upfront avoids repeated reallocations. Conversely, ArrayList never auto-shrinks — call trimToSize() to reclaim unused memory. This growth strategy balances memory waste against copy frequency.",
  },

  // === JVM ===
  {
    id: "tq-jvm-4",
    topic: "JVM",
    difficulty: "Easy",
    question: "What is JIT compilation in the JVM? Explain the difference between C1 and C2 compilers.",
    keyPoints: ["Interpreted vs compiled execution", "Tiered compilation", "C1: fast, less optimized", "C2: aggressive optimization, profiling-guided"],
    sampleAnswer: "The JVM starts by interpreting bytecode, then uses Just-In-Time (JIT) compilation to compile hot methods to native code. Tiered compilation (default since Java 8) uses two compilers: C1 (Client) compiles quickly with basic optimizations — ideal for startup-sensitive code. C2 (Server) applies aggressive optimizations (inlining, escape analysis, loop unrolling) based on profiling data gathered during C1 execution. Methods move through tiers (0=interpreted → 1/2/3=C1 → 4=C2) based on invocation counts and back-edge counts. JIT-compiled code is stored in the Code Cache; if it overflows, methods fall back to interpretation.",
  },
  {
    id: "tq-jvm-5",
    topic: "JVM",
    difficulty: "Medium",
    question: "What is escape analysis and how does it enable stack allocation and lock elision?",
    keyPoints: ["Object scope analysis", "Stack allocation vs heap", "Lock elision for non-escaping objects", "Scalar replacement"],
    sampleAnswer: "Escape analysis is a JIT optimization that determines whether an object's reference can 'escape' the method or thread that created it. If an object does not escape: (1) Stack Allocation — the object can be allocated on the stack instead of the heap, avoiding GC pressure. (2) Scalar Replacement — the object may be decomposed into individual primitive fields placed in registers. (3) Lock Elision — if a synchronized block uses a non-escaping object (e.g., a locally created StringBuilder), the lock is removed since no other thread can contend on it. Escape analysis is automatically applied by C2 and can significantly reduce GC overhead for short-lived objects.",
  },
  {
    id: "tq-jvm-6",
    topic: "JVM",
    difficulty: "Hard",
    question: "What is the Java Memory Model (JMM)? Explain visibility, atomicity, ordering, and the happens-before guarantee.",
    keyPoints: ["Shared memory and CPU caches", "Reordering by compiler/CPU", "happens-before rules", "Data races and safe publication"],
    sampleAnswer: "The JMM defines how threads interact through memory. CPUs and compilers may reorder instructions and cache writes locally, causing visibility issues across threads. The JMM establishes happens-before relationships to define when one thread's writes are guaranteed to be visible to another. Key rules: (1) Program order — each action in a thread happens-before subsequent actions in the same thread. (2) Monitor lock — an unlock happens-before every subsequent lock on the same monitor. (3) volatile write — a write to a volatile field happens-before every subsequent read of that field. (4) Thread start/join. Without these, you have a data race. Safe publication (via final fields, volatile, or synchronized) ensures objects are correctly visible after construction.",
  },

  // === CONCURRENCY ===
  {
    id: "tq-con-5",
    topic: "Concurrency",
    difficulty: "Easy",
    question: "What is a deadlock? How do you detect and prevent it in Java?",
    keyPoints: ["Circular wait condition", "4 Coffman conditions", "Lock ordering", "tryLock with timeout"],
    sampleAnswer: "A deadlock occurs when two or more threads hold locks and each is waiting for a lock held by another, creating a circular wait. The four Coffman conditions (all must hold): mutual exclusion, hold-and-wait, no preemption, circular wait. Prevention strategies: (1) Lock ordering — always acquire multiple locks in a globally consistent order to break circular wait. (2) tryLock with timeout (ReentrantLock) — back off and retry if a lock isn't available within time. (3) Lock timeout with backoff. Detection: thread dumps (jstack) or JMX MXBeans (ThreadMXBean.findDeadlockedThreads()). Avoid acquiring multiple locks when possible; prefer higher-level concurrency abstractions.",
  },
  {
    id: "tq-con-6",
    topic: "Concurrency",
    difficulty: "Medium",
    question: "What are the differences between CountDownLatch, CyclicBarrier, and Semaphore? Give use cases for each.",
    keyPoints: ["One-time vs reusable", "Count down vs wait at barrier", "Permits and rate control", "await() semantics"],
    sampleAnswer: "CountDownLatch: a one-shot latch where one or more threads wait until a count reaches zero (decremented by other threads with countDown()). Use case: wait for N services to initialize before starting. CyclicBarrier: all N threads must call await() before any can proceed; reusable after each cycle. Use case: iterative parallel algorithms where all threads must complete a phase before starting the next. Semaphore: controls access to a fixed pool of resources via acquire()/release(). Use case: limiting concurrent DB connections or file handles. Key difference: CountDownLatch counts down to zero from any thread; CyclicBarrier counts waiting threads up to N; Semaphore manages available permits.",
  },
  {
    id: "tq-con-7",
    topic: "Concurrency",
    difficulty: "Hard",
    question: "Explain the ForkJoinPool and work-stealing algorithm. When should you use it instead of a regular ExecutorService?",
    keyPoints: ["Divide-and-conquer tasks", "Work-stealing deque per thread", "RecursiveTask vs RecursiveAction", "commonPool vs custom pool"],
    sampleAnswer: "ForkJoinPool is designed for divide-and-conquer parallelism. Each worker thread has its own double-ended deque (deque). Tasks fork (split) and push subtasks to the local deque; idle threads steal tasks from the tail of other threads' deques, maximizing CPU utilization. RecursiveTask<V> returns a result; RecursiveAction is void. ForkJoinPool.commonPool() is shared across the JVM (used by parallel streams, CompletableFuture async methods). Use ForkJoinPool for CPU-bound, recursively decomposable tasks (merge sort, tree traversal). Avoid it for I/O-bound tasks — blocking a FJP thread starves the pool; use a dedicated ExecutorService instead.",
  },

  // === SPRING BOOT ===
  {
    id: "tq-sb-5",
    topic: "Spring Boot",
    difficulty: "Easy",
    question: "What is the difference between @Component, @Service, @Repository, and @Controller in Spring?",
    keyPoints: ["Stereotype annotations", "Functional differentiation", "@Repository exception translation", "Component scanning"],
    sampleAnswer: "@Component is the generic stereotype — marks a class as a Spring-managed bean. @Service, @Repository, and @Controller are specializations that carry semantic meaning and enable additional behavior. @Repository adds automatic persistence exception translation — DataAccessExceptions are wrapped from vendor-specific SQL exceptions. @Controller (or @RestController = @Controller + @ResponseBody) enables Spring MVC request mapping. @Service has no extra behavior but signals business logic, improving code clarity. All four are picked up by @ComponentScan. Prefer the specific annotations over bare @Component for clarity and to benefit from framework-level enhancements (especially @Repository).",
  },
  {
    id: "tq-sb-6",
    topic: "Spring Boot",
    difficulty: "Medium",
    question: "How does Spring Security work at a high level? Explain the filter chain, authentication, and authorization flow.",
    keyPoints: ["SecurityFilterChain", "AuthenticationManager / Provider", "SecurityContext and ThreadLocal", "Method security with @PreAuthorize"],
    sampleAnswer: "Spring Security operates as a chain of servlet filters. Every request passes through the SecurityFilterChain: UsernamePasswordAuthenticationFilter (or JWT filter) extracts credentials and creates an Authentication token. This is passed to AuthenticationManager, which delegates to an AuthenticationProvider (e.g., DaoAuthenticationProvider loads UserDetails from a UserDetailsService). On success, the Authentication object is stored in SecurityContextHolder (backed by ThreadLocal). Authorization happens at the FilterSecurityInterceptor (URL-based) or via AOP for method-level security (@PreAuthorize, @Secured). On failure, AuthenticationEntryPoint or AccessDeniedHandler returns 401/403 responses.",
  },
  {
    id: "tq-sb-7",
    topic: "Spring Boot",
    difficulty: "Hard",
    question: "Explain Spring AOP. What is the difference between JDK dynamic proxy and CGLIB proxy? When does each apply?",
    keyPoints: ["Aspect, Advice, Pointcut, JoinPoint", "JDK proxy requires interface", "CGLIB subclasses the target", "AspectJ weaving vs Spring AOP"],
    sampleAnswer: "Spring AOP uses proxies to intercept method calls (JoinPoints) defined by Pointcuts and apply Advice (Before, After, Around, etc.). JDK dynamic proxy: works only if the target implements at least one interface — the proxy implements the same interface(s). CGLIB proxy: subclasses the target class at runtime, so it works even without interfaces but cannot proxy final classes or methods. Spring Boot auto-configures CGLIB by default (spring.aop.proxy-target-class=true). Key limitation: Spring AOP only intercepts method calls through the proxy — self-invocation (this.method()) bypasses it. AspectJ load-time or compile-time weaving offers full interception but is more complex to configure.",
  },

  // === MICROSERVICES ===
  {
    id: "tq-ms-4",
    topic: "Microservices",
    difficulty: "Easy",
    question: "What is an API Gateway? What cross-cutting concerns does it handle?",
    keyPoints: ["Single entry point", "Auth, rate limiting, routing", "SSL termination", "Request aggregation"],
    sampleAnswer: "An API Gateway is a single entry point for all client requests to a microservices backend. It handles cross-cutting concerns: (1) Authentication/Authorization — validate JWT or API keys before forwarding requests. (2) Rate Limiting — protect backend services from overload. (3) SSL Termination — decrypt TLS at the gateway, use plain HTTP internally. (4) Request Routing — forward to appropriate microservice based on path or headers. (5) Request Aggregation — fan out to multiple services and combine responses (reducing client round trips). (6) Load Balancing, logging, and distributed tracing injection (correlation IDs). Popular implementations: Spring Cloud Gateway, AWS API Gateway, Kong, NGINX.",
  },
  {
    id: "tq-ms-5",
    topic: "Microservices",
    difficulty: "Medium",
    question: "Explain the Outbox Pattern. How does it solve the dual-write problem in event-driven microservices?",
    keyPoints: ["Dual-write inconsistency risk", "Transactional outbox table", "Change Data Capture (CDC)", "At-least-once delivery"],
    sampleAnswer: "The dual-write problem: when a service must write to its database AND publish an event, either operation can fail independently, leading to inconsistency. The Outbox Pattern solves this by writing both the business data and the event to an outbox table within a single database transaction — atomically. A separate process (using Polling or Change Data Capture via Debezium + Kafka) reads the outbox table and publishes events to the message broker, then marks them as published. This guarantees at-least-once delivery. Consumers must be idempotent to handle duplicate events. CDC-based approaches are preferred as they minimize polling latency and database load.",
  },
  {
    id: "tq-ms-6",
    topic: "Microservices",
    difficulty: "Hard",
    question: "What is service mesh? Compare Istio and Linkerd. When would you introduce a service mesh?",
    keyPoints: ["Sidecar proxy pattern", "mTLS, observability, traffic management", "Control plane vs data plane", "Operational overhead trade-offs"],
    sampleAnswer: "A service mesh manages service-to-service communication via sidecar proxies (data plane) deployed alongside each service, controlled by a centralized control plane. Features: mTLS (automatic mutual TLS), distributed tracing, traffic splitting (canary deployments), retries, circuit breaking, and observability — without application code changes. Istio uses Envoy proxies and has a feature-rich control plane (Istiod) but is complex and resource-heavy. Linkerd is lighter-weight, using a Rust-based proxy and simpler configuration, better for teams new to service mesh. Introduce a service mesh when: you have 10+ services with complex inter-service security or traffic management needs; not for small deployments where the operational overhead outweighs benefits.",
  },

  // === DATABASE DESIGN ===
  {
    id: "tq-db-4",
    topic: "Database Design",
    difficulty: "Easy",
    question: "What are database transactions and ACID properties? Give a real-world example of each property.",
    keyPoints: ["Atomicity, Consistency, Isolation, Durability", "Commit and rollback", "Isolation levels", "Write-ahead logging for durability"],
    sampleAnswer: "ACID ensures reliable transactions: Atomicity — a bank transfer either debits one account AND credits another, or neither happens (all-or-nothing). Consistency — the database transitions from one valid state to another (account balance cannot go negative if a constraint prevents it). Isolation — two concurrent transfers don't interfere; each sees a consistent snapshot (levels: Read Uncommitted, Read Committed, Repeatable Read, Serializable). Durability — once committed, the transfer survives a crash, ensured by Write-Ahead Logging (WAL) that persists changes to disk before acknowledging the commit. Databases trade isolation level for performance — higher isolation (Serializable) reduces concurrency.",
  },
  {
    id: "tq-db-5",
    topic: "Database Design",
    difficulty: "Medium",
    question: "Explain database sharding. What are the strategies and the challenges it introduces?",
    keyPoints: ["Horizontal partitioning", "Hash vs range sharding", "Cross-shard queries", "Rebalancing and hotspots"],
    sampleAnswer: "Sharding splits data horizontally across multiple database nodes (shards), each owning a subset of the data. Strategies: Hash Sharding (shard = hash(key) % N) — even distribution but range queries hit all shards. Range Sharding (shard by ID or date ranges) — efficient range queries but risks hotspots on recent data. Directory-based Sharding uses a lookup service for flexible mapping. Challenges: (1) Cross-shard joins — no longer possible; must be handled in application code. (2) Distributed transactions — difficult to maintain ACID across shards. (3) Rebalancing — adding shards requires data migration; consistent hashing minimizes data movement. (4) Global uniqueness — primary keys must be shard-aware (Snowflake IDs).",
  },
  {
    id: "tq-db-6",
    topic: "Database Design",
    difficulty: "Hard",
    question: "What are read replicas and how do you handle replication lag in your application?",
    keyPoints: ["Primary-replica replication", "Asynchronous vs synchronous replication", "Read-your-writes consistency", "Monotonic reads"],
    sampleAnswer: "Read replicas receive asynchronous log-based replication from the primary, enabling horizontal read scaling. Replication lag (typically milliseconds, but can spike under load) introduces consistency challenges: (1) Read-your-writes — a user writes data, then immediately reads from a replica that hasn't replicated yet, seeing stale data. Fix: route reads for the same user to the primary for a brief window, or use synchronous replication for critical paths. (2) Monotonic reads — a user refreshes and gets older data than before (read two different replicas). Fix: sticky routing — route a user's reads to the same replica. (3) Monitor replication lag via Seconds_Behind_Master and alert on thresholds. For strong consistency requirements, route all reads to primary, sacrificing read scaling.",
  },

  // === SYSTEM DESIGN ===
  {
    id: "tq-sd-3",
    topic: "System Design",
    difficulty: "Medium",
    question: "Design a notification system that can send emails, SMS, and push notifications to millions of users. Discuss scalability and reliability.",
    keyPoints: ["Message queue decoupling", "Fan-out for bulk sends", "Retry with exponential backoff", "Idempotency and deduplication", "Provider fallback"],
    sampleAnswer: "Architecture: API layer accepts notification requests and writes to a Kafka topic (decoupling producers from consumers). Downstream workers consume from Kafka by channel type (email, SMS, push) and call provider APIs (SendGrid, Twilio, FCM/APNs). For bulk notifications (marketing): pre-compute user segments, fan out writes to Kafka partitioned by user_id for parallel processing. Reliability: idempotency key per notification to prevent duplicates on retry. Retry with exponential backoff + dead-letter queue for failed deliveries. Provider fallback: if SendGrid is down, route to SES. Rate limiting per provider API. Observability: track delivery status in a NoSQL store (DynamoDB), expose delivery metrics. Priority queues: separate topics for transactional (high priority) vs marketing (lower priority) notifications.",
  },
  {
    id: "tq-sd-4",
    topic: "System Design",
    difficulty: "Hard",
    question: "Design a distributed cache like Redis. What data structures, eviction policies, and persistence mechanisms would you support?",
    keyPoints: ["In-memory storage with hash table", "LRU / LFU / TTL eviction", "RDB snapshots vs AOF persistence", "Replication and cluster mode"],
    sampleAnswer: "Core: an in-memory hash table mapping keys to values. Support rich data structures: String (simple KV), Hash (field-value map), List (doubly-linked list), Set, Sorted Set (skip list + hash map for O(log n) rank queries). Eviction policies: LRU (evict least recently used), LFU (evict least frequently used), allkeys-random, volatile-ttl. Persistence: RDB (periodic snapshots — fast recovery, may lose recent data) and AOF (Append-Only File — logs every write command for durability, replayed on restart; use fsync=everysec for balance). Replication: async primary-replica with Sentinel for failover. Cluster mode: data sharded via consistent hashing (16384 slots) across nodes for horizontal scaling. Pipelining and Lua scripts for atomic multi-command operations.",
  },

  // === AI/ML SYSTEMS ===
  {
    id: "tq-ai-4",
    topic: "AI/ML Systems",
    difficulty: "Easy",
    question: "What is overfitting and underfitting? How do you detect and address each?",
    keyPoints: ["Bias-variance tradeoff", "Training vs validation loss curves", "Regularization (L1/L2, dropout)", "Cross-validation and early stopping"],
    sampleAnswer: "Overfitting: the model learns training data too well, including noise — low training error but high validation error. Underfitting: the model is too simple to capture patterns — high error on both training and validation. Detect via learning curves: overfitting shows a growing gap between train and validation loss; underfitting shows both losses plateauing at high values. Address overfitting: L2 regularization (weight decay) penalizes large weights, Dropout randomly disables neurons during training, data augmentation, early stopping, or more training data. Address underfitting: increase model capacity (more layers/neurons), reduce regularization, add features, or train longer. The bias-variance tradeoff requires tuning model complexity to balance both extremes.",
  },
  {
    id: "tq-ai-5",
    topic: "AI/ML Systems",
    difficulty: "Medium",
    question: "What is RAG (Retrieval-Augmented Generation)? How would you build a RAG pipeline for an internal knowledge base?",
    keyPoints: ["Embedding-based retrieval", "Vector database", "Chunking strategy", "Context injection into LLM prompt", "Hallucination reduction"],
    sampleAnswer: "RAG combines a retrieval system with an LLM generator. Instead of relying solely on the model's parametric knowledge, relevant documents are retrieved at inference time and injected into the prompt. Pipeline: (1) Indexing — chunk documents into passages (typically 256-512 tokens with overlap), generate embeddings via a sentence-transformer model, store in a vector database (Pinecone, Weaviate, pgvector). (2) Retrieval — embed the user query, perform ANN search to find top-K similar chunks. (3) Generation — prepend retrieved chunks as context in the LLM prompt. Key design choices: chunk size (larger = more context, lower recall; smaller = higher recall, less context), reranking retrieved chunks (cross-encoder), and filtering by metadata. RAG reduces hallucinations since the model grounds answers in retrieved facts.",
  },
  {
    id: "tq-ai-6",
    topic: "AI/ML Systems",
    difficulty: "Hard",
    question: "Explain the training process of a large language model. What are pre-training, SFT, RLHF, and how do they relate?",
    keyPoints: ["Self-supervised next-token prediction", "Supervised fine-tuning on instructions", "Reward model and PPO", "Alignment vs capability"],
    sampleAnswer: "LLM training has three phases: (1) Pre-training — the base model is trained on massive text corpora via self-supervised next-token prediction. The model learns language patterns, facts, and reasoning but is not instruction-following. (2) Supervised Fine-Tuning (SFT) — the pre-trained model is fine-tuned on curated (prompt, response) pairs demonstrating desired behavior (instruction following, helpfulness). (3) RLHF (Reinforcement Learning from Human Feedback) — human raters compare model outputs; a Reward Model is trained to predict human preference scores. The LLM is then optimized with PPO (Proximal Policy Optimization) to maximize reward while staying close to the SFT model (via KL divergence penalty). RLHF aligns the model's outputs with human values and reduces harmful outputs, at some cost to raw capability.",
  },

  // === JVM ===
  {
    id: "tq-jvm-1",
    topic: "JVM",
    difficulty: "Easy",
    question: "Explain the JVM memory model. What are the different memory areas?",
    keyPoints: ["Heap vs Stack", "Method Area / Metaspace", "PC Register", "Native Method Stack"],
    sampleAnswer: "The JVM memory is divided into: Heap (shared, stores objects and arrays, managed by GC), Stack (per-thread, stores local variables and method call frames), Method Area / Metaspace (stores class metadata, constant pool, method data — moved from PermGen to native memory in Java 8), PC Register (per-thread, stores the address of the current JVM instruction), and Native Method Stack (supports native method execution). The Heap is further divided into Young Generation (Eden + Survivor spaces) and Old Generation for generational GC.",
  },
  {
    id: "tq-jvm-2",
    topic: "JVM",
    difficulty: "Medium",
    question: "Describe the different garbage collection algorithms in Java. When would you use G1GC vs ZGC?",
    keyPoints: ["Serial, Parallel, CMS, G1, ZGC, Shenandoah", "Pause time vs throughput", "Region-based collection", "Sub-millisecond pauses"],
    sampleAnswer: "Serial GC is single-threaded, suitable for small heaps. Parallel GC maximizes throughput with multi-threaded stop-the-world collections. G1GC (default since Java 9) divides the heap into equal-sized regions, prioritizes collecting regions with the most garbage first, and targets configurable pause-time goals (200ms default). ZGC (production since Java 15) achieves sub-millisecond pauses regardless of heap size by performing almost all work concurrently using colored pointers and load barriers. Use G1GC for general workloads; choose ZGC for latency-sensitive applications with large heaps.",
  },
  {
    id: "tq-jvm-3",
    topic: "JVM",
    difficulty: "Hard",
    question: "How does the classloading mechanism work in Java? Explain the delegation model.",
    keyPoints: ["Bootstrap, Extension, Application classloaders", "Parent delegation model", "Class loading phases", "Custom classloaders"],
    sampleAnswer: "Java uses a hierarchical classloading delegation model. When a class is requested, the Application ClassLoader delegates to Extension (Platform), which delegates to Bootstrap. Each checks if it has already loaded the class; only if the parent can't load it does the child attempt to. Bootstrap loads core java.* classes from rt.jar, Extension loads javax.* and extension JARs, Application loads from classpath. Loading has three phases: Loading (finds and reads .class bytes), Linking (verification, preparation, optional resolution), and Initialization (runs static initializers). Custom classloaders override findClass() for dynamic loading, hot-reloading, or isolation (used by Tomcat, OSGi).",
  },

  // === CONCURRENCY ===
  {
    id: "tq-con-1",
    topic: "Concurrency",
    difficulty: "Easy",
    question: "What is the difference between Thread, Runnable, and Callable in Java?",
    keyPoints: ["Thread extends vs Runnable implements", "Callable returns a value", "Future for result retrieval", "ExecutorService submission"],
    sampleAnswer: "Thread is a class you can extend (limits inheritance), Runnable is a functional interface with void run() that you can pass to a Thread or executor. Callable<V> is similar to Runnable but returns a result of type V and can throw checked exceptions. You submit Callable to an ExecutorService, which returns a Future<V> that you can poll or block on to get the result. Prefer Runnable/Callable with executors over extending Thread directly.",
  },
  {
    id: "tq-con-2",
    topic: "Concurrency",
    difficulty: "Medium",
    question: "Explain the volatile keyword. How does it relate to the Java Memory Model's happens-before relationship?",
    keyPoints: ["Visibility guarantee", "No atomicity for compound operations", "Happens-before ordering", "Memory barrier / fence"],
    sampleAnswer: "The volatile keyword guarantees that reads and writes to the variable go directly to main memory, ensuring visibility across threads. A write to a volatile variable happens-before any subsequent read of that same variable — this establishes a happens-before relationship in the JMM. However, volatile does NOT guarantee atomicity for compound operations like i++. It inserts memory barriers: a StoreStore barrier before the write and a LoadLoad barrier before the read. Use volatile for simple flags or status fields where only one thread writes.",
  },
  {
    id: "tq-con-3",
    topic: "Concurrency",
    difficulty: "Hard",
    question: "What are the differences between ReentrantLock and synchronized? Explain lock fairness, tryLock, and Condition variables.",
    keyPoints: ["Explicit lock/unlock vs implicit", "Fairness policy", "tryLock with timeout", "Multiple Condition objects", "Lock interruptibility"],
    sampleAnswer: "ReentrantLock provides explicit locking with more control than synchronized. Key differences: (1) Fairness — ReentrantLock can be constructed with fair=true to grant the lock in FIFO order, preventing starvation; synchronized is inherently unfair. (2) tryLock() with optional timeout for non-blocking lock acquisition. (3) lockInterruptibly() allows a waiting thread to be interrupted. (4) Multiple Condition objects from one lock, vs. synchronized's single wait/notify set. (5) Must manually unlock in a finally block. Use ReentrantLock when you need these features; synchronized suffices for simple mutual exclusion.",
  },
  {
    id: "tq-con-4",
    topic: "Concurrency",
    difficulty: "Medium",
    question: "Explain CompletableFuture and how it enables asynchronous, non-blocking programming in Java.",
    keyPoints: ["thenApply, thenCompose, thenCombine", "Async variants with custom executors", "Exception handling with exceptionally/handle", "allOf/anyOf composition"],
    sampleAnswer: "CompletableFuture (Java 8) enables chaining and composing asynchronous operations. thenApply transforms results, thenCompose flattens nested futures (like flatMap), thenCombine merges two independent results. Each has an async variant that runs on ForkJoinPool.commonPool() or a custom executor. Exception handling uses exceptionally() for fallback values or handle() for both success and error. allOf() waits for all futures, anyOf() completes on the first. This allows building non-blocking pipelines: fetch user -> fetch orders -> compute discount, all without blocking threads.",
  },

  // === SPRING BOOT ===
  {
    id: "tq-sb-1",
    topic: "Spring Boot",
    difficulty: "Easy",
    question: "What is dependency injection in Spring? Explain the difference between @Autowired, constructor injection, and setter injection.",
    keyPoints: ["IoC principle", "Constructor injection (preferred)", "Field injection via @Autowired", "Immutability and testability"],
    sampleAnswer: "Dependency Injection is an implementation of Inversion of Control where the container provides dependencies to a class rather than the class creating them. Constructor injection is preferred — it enforces required dependencies, supports immutability (final fields), and makes testing easy. @Autowired on fields is convenient but hides dependencies and prevents final fields. Setter injection is for optional dependencies. Since Spring 4.3, if a class has only one constructor, @Autowired is implicit. The Spring container resolves dependencies by type, falling back to @Qualifier for disambiguation.",
  },
  {
    id: "tq-sb-2",
    topic: "Spring Boot",
    difficulty: "Medium",
    question: "How does Spring Boot auto-configuration work? Explain @EnableAutoConfiguration and spring.factories.",
    keyPoints: ["@SpringBootApplication = @Configuration + @EnableAutoConfiguration + @ComponentScan", "Conditional annotations", "META-INF/spring.factories", "Starter dependencies"],
    sampleAnswer: "Spring Boot auto-configuration examines your classpath and automatically configures beans. @EnableAutoConfiguration triggers scanning of META-INF/spring.factories (or spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports in Spring Boot 3) for auto-configuration classes. Each uses conditional annotations like @ConditionalOnClass, @ConditionalOnMissingBean, @ConditionalOnProperty to decide whether to apply. For example, if H2 is on the classpath and no DataSource bean exists, it auto-configures an in-memory H2 DataSource. Starter POMs bundle related dependencies. You can exclude specific auto-configs via @EnableAutoConfiguration(exclude=...).",
  },
  {
    id: "tq-sb-3",
    topic: "Spring Boot",
    difficulty: "Medium",
    question: "Explain the Spring Bean lifecycle. What hooks are available for initialization and destruction?",
    keyPoints: ["Instantiation -> Populate properties -> Aware interfaces -> BeanPostProcessor -> Init -> Ready -> Destroy", "@PostConstruct, @PreDestroy", "InitializingBean, DisposableBean", "Custom init-method/destroy-method"],
    sampleAnswer: "The Spring Bean lifecycle: (1) Instantiation via constructor, (2) Dependency injection / property population, (3) Aware interface callbacks (BeanNameAware, BeanFactoryAware, ApplicationContextAware), (4) BeanPostProcessor.postProcessBeforeInitialization, (5) @PostConstruct / InitializingBean.afterPropertiesSet / custom init-method, (6) BeanPostProcessor.postProcessAfterInitialization — bean is now ready. On shutdown: @PreDestroy / DisposableBean.destroy / custom destroy-method. @PostConstruct and @PreDestroy are the most commonly used hooks.",
  },
  {
    id: "tq-sb-4",
    topic: "Spring Boot",
    difficulty: "Hard",
    question: "How does Spring handle transactions? Explain @Transactional, propagation levels, and common pitfalls.",
    keyPoints: ["Proxy-based AOP", "Propagation: REQUIRED, REQUIRES_NEW, NESTED", "Isolation levels", "Self-invocation pitfall", "Checked vs unchecked exception rollback"],
    sampleAnswer: "@Transactional uses AOP proxies to wrap methods in a transaction. Key propagation types: REQUIRED (join existing or create new), REQUIRES_NEW (always create new, suspending the current), NESTED (savepoint within existing). Common pitfalls: (1) Self-invocation — calling a @Transactional method from within the same class bypasses the proxy, so no transaction is applied. Fix: inject self or use AopContext. (2) By default, only unchecked exceptions trigger rollback; checked exceptions don't unless you specify rollbackFor. (3) @Transactional on private methods is silently ignored. (4) Isolation levels (READ_COMMITTED, REPEATABLE_READ) must match your database's capabilities.",
  },

  // === MICROSERVICES ===
  {
    id: "tq-ms-1",
    topic: "Microservices",
    difficulty: "Easy",
    question: "What are the key differences between monolithic and microservices architecture? What are the trade-offs?",
    keyPoints: ["Deployment independence", "Technology heterogeneity", "Distributed complexity", "Team autonomy", "Network latency"],
    sampleAnswer: "Monolithic: single deployable unit, simpler development and debugging, but scaling requires scaling everything, and a single bug can bring down the entire system. Microservices: independently deployable services with bounded contexts, enabling team autonomy, independent scaling, and technology diversity. Trade-offs include distributed system complexity (network failures, eventual consistency), operational overhead (monitoring, tracing, deployment pipelines for each service), data management challenges (no cross-service joins), and the need for service discovery, API gateways, and circuit breakers. Start monolithic, decompose when complexity warrants it.",
  },
  {
    id: "tq-ms-2",
    topic: "Microservices",
    difficulty: "Medium",
    question: "Explain the Circuit Breaker pattern. How does Resilience4j implement it?",
    keyPoints: ["Closed, Open, Half-Open states", "Failure rate threshold", "Wait duration in open state", "Fallback mechanisms", "Ring buffer / sliding window"],
    sampleAnswer: "The Circuit Breaker pattern prevents cascading failures by monitoring calls to a remote service. In the Closed state, calls pass through normally. If the failure rate exceeds a threshold (e.g., 50% over 10 calls in Resilience4j's sliding window), it transitions to Open, immediately rejecting calls for a configured wait duration. After the wait, it enters Half-Open, allowing a limited number of trial calls — if they succeed, it returns to Closed; if they fail, it goes back to Open. Resilience4j provides CircuitBreaker, RateLimiter, Retry, Bulkhead, and TimeLimiter as composable decorators.",
  },
  {
    id: "tq-ms-3",
    topic: "Microservices",
    difficulty: "Hard",
    question: "How would you handle distributed transactions across microservices? Explain the Saga pattern.",
    keyPoints: ["Two-phase commit problems", "Choreography vs Orchestration saga", "Compensating transactions", "Eventual consistency", "Idempotency"],
    sampleAnswer: "In microservices, two-phase commit is generally avoided due to tight coupling and performance issues. The Saga pattern breaks a distributed transaction into a sequence of local transactions, each publishing events to trigger the next step. There are two approaches: Choreography (each service listens to events and acts — simpler but harder to track), and Orchestration (a central orchestrator coordinates steps — clearer flow but can become a bottleneck). If any step fails, compensating transactions undo previous steps. Key requirements: each step must be idempotent (safe to retry), compensating actions must exist for every step, and the system embraces eventual consistency.",
  },

  // === DATABASE DESIGN ===
  {
    id: "tq-db-1",
    topic: "Database Design",
    difficulty: "Easy",
    question: "What are database indexes? Explain B-tree indexes and when to use or avoid them.",
    keyPoints: ["B-tree structure", "Composite indexes", "Index selectivity", "Write overhead", "Covering indexes"],
    sampleAnswer: "A database index is a data structure (typically B-tree) that speeds up row retrieval. B-tree indexes maintain sorted data in balanced tree pages, enabling O(log n) lookups, range scans, and sorted output. Composite indexes work left-to-right (leftmost prefix rule). Use indexes on frequently queried columns (WHERE, JOIN, ORDER BY) with high selectivity (many distinct values). Avoid indexing: columns with low selectivity (booleans), tables with heavy writes (each index adds write overhead), and columns rarely used in queries. A covering index includes all columns needed by a query, avoiding table lookups entirely.",
  },
  {
    id: "tq-db-2",
    topic: "Database Design",
    difficulty: "Medium",
    question: "Explain database normalization up to 3NF. When might you intentionally denormalize?",
    keyPoints: ["1NF: atomic values", "2NF: no partial dependency", "3NF: no transitive dependency", "Denormalization for read performance", "Materialized views"],
    sampleAnswer: "1NF: Every column holds atomic (indivisible) values, no repeating groups. 2NF: No partial dependencies — every non-key column depends on the entire primary key (relevant for composite keys). 3NF: No transitive dependencies — non-key columns depend only on the primary key, not on other non-key columns. Intentional denormalization is useful for read-heavy workloads: caching aggregated data, storing derived fields to avoid expensive joins, or creating read-optimized materialized views. Common in microservices where each service owns its data, and in data warehouses using star/snowflake schemas.",
  },
  {
    id: "tq-db-3",
    topic: "Database Design",
    difficulty: "Hard",
    question: "Compare SQL and NoSQL databases. When would you choose each? Discuss CAP theorem implications.",
    keyPoints: ["ACID vs BASE", "CAP theorem: Consistency, Availability, Partition tolerance", "Document, Key-Value, Column-family, Graph stores", "Horizontal vs vertical scaling"],
    sampleAnswer: "SQL databases (PostgreSQL, MySQL) provide ACID transactions, strong consistency, complex joins, and structured schemas. NoSQL covers four models: Document (MongoDB — flexible schemas), Key-Value (Redis — caching, sessions), Column-family (Cassandra — time-series, high write throughput), Graph (Neo4j — relationship-heavy queries). CAP theorem states a distributed system can only guarantee two of three: Consistency, Availability, Partition Tolerance. Since network partitions are inevitable, you choose between CP (strong consistency, may be unavailable during partitions — HBase, MongoDB) or AP (always available, eventually consistent — Cassandra, DynamoDB). Choose SQL for transactional integrity; NoSQL for flexible schemas, massive scale, or specialized access patterns.",
  },

  // === SYSTEM DESIGN ===
  {
    id: "tq-sd-1",
    topic: "System Design",
    difficulty: "Medium",
    question: "Design a URL shortener like TinyURL. Walk through the high-level architecture and key design decisions.",
    keyPoints: ["Base62 encoding", "Hash collisions", "Database schema", "Cache layer", "Analytics", "301 vs 302 redirect"],
    sampleAnswer: "Core flow: POST long URL -> generate short code -> store mapping -> return short URL. For ID generation, use a counter-based approach (auto-increment ID -> Base62 encode) or random key generation with collision checking. Database: key-value store (short_code -> long_url, created_at, expiry, user_id). Read-heavy (100:1 read:write ratio), so add a Redis cache in front. Use 301 (permanent) redirects for browser caching or 302 (temporary) for analytics tracking. Scale: application servers behind a load balancer, horizontally scaled. For high throughput, pre-generate IDs using a counter service (like Twitter Snowflake). Custom aliases need uniqueness checks. Add rate limiting and abuse detection.",
  },
  {
    id: "tq-sd-2",
    topic: "System Design",
    difficulty: "Hard",
    question: "How would you design a rate limiter for an API gateway? Discuss different algorithms and distributed considerations.",
    keyPoints: ["Token Bucket, Leaky Bucket, Sliding Window", "Redis-based distributed counting", "Race conditions with MULTI/EXEC or Lua scripts", "Per-user, per-IP, per-API key limits"],
    sampleAnswer: "Algorithms: Token Bucket (refills tokens at a fixed rate, smooth bursts allowed — most common), Leaky Bucket (processes at fixed rate, queues excess — smoothest output), Fixed Window Counter (simple but has boundary spike problem), Sliding Window Log (precise but memory-heavy), Sliding Window Counter (approximates sliding window using current and previous counters — best balance). For distribution, use Redis with Lua scripts for atomic check-and-increment to avoid race conditions. Store counters keyed by user_id:timestamp_window. Apply limits at multiple levels: per-IP, per-user, per-API-key. Return 429 with Retry-After header. Use headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset.",
  },

  // === AI/ML SYSTEMS ===
  {
    id: "tq-ai-1",
    topic: "AI/ML Systems",
    difficulty: "Easy",
    question: "What is the difference between supervised, unsupervised, and reinforcement learning? Give examples of each.",
    keyPoints: ["Labeled data vs unlabeled data", "Classification and regression", "Clustering and dimensionality reduction", "Reward-based learning"],
    sampleAnswer: "Supervised Learning: trains on labeled data (input-output pairs). Examples: image classification (label: cat/dog), spam detection, house price prediction (regression). Unsupervised Learning: finds patterns in unlabeled data. Examples: customer segmentation (k-means clustering), anomaly detection, dimensionality reduction (PCA). Reinforcement Learning: an agent learns by interacting with an environment, receiving rewards/penalties. Examples: game-playing (AlphaGo), robotics control, recommendation systems. Semi-supervised learning combines labeled and unlabeled data. Self-supervised learning creates labels from the data itself (like predicting the next word in text — foundation of LLMs).",
  },
  {
    id: "tq-ai-2",
    topic: "AI/ML Systems",
    difficulty: "Medium",
    question: "How would you design a recommendation system for an e-commerce platform? Discuss different approaches.",
    keyPoints: ["Collaborative filtering", "Content-based filtering", "Hybrid approaches", "Cold start problem", "A/B testing"],
    sampleAnswer: "Three main approaches: (1) Collaborative Filtering — item-based (users who bought X also bought Y) or user-based (similar users liked these items), using matrix factorization (ALS, SVD) for scalability. (2) Content-based — recommends items similar to what the user has interacted with, based on item features (category, description embeddings). (3) Hybrid — combines both. Address cold-start: for new users, use popular items or demographic-based recommendations; for new items, use content features. Architecture: offline batch processing (Spark) for model training, real-time serving via pre-computed item embeddings with ANN (approximate nearest neighbor) search using FAISS or Pinecone. Evaluate via offline metrics (precision@k, NDCG) and online A/B tests.",
  },
  {
    id: "tq-ai-3",
    topic: "AI/ML Systems",
    difficulty: "Easy",
    question: "What is the Transformer architecture? Why did it replace RNNs for NLP tasks?",
    keyPoints: ["Self-attention mechanism", "Parallelization vs sequential RNNs", "Positional encoding", "Encoder-decoder structure"],
    sampleAnswer: "The Transformer (Vaswani et al., 2017 — 'Attention is All You Need') replaced RNNs by using self-attention instead of recurrence. Self-attention computes relationships between all positions in a sequence simultaneously, enabling massive parallelization (RNNs are inherently sequential). It uses Query-Key-Value attention: Q*K^T/sqrt(d_k) gives attention weights, applied to V. Multi-head attention captures different relationship types. Positional encoding (sinusoidal or learned) injects sequence order since attention is position-agnostic. The encoder-decoder structure powers translation; encoder-only (BERT) for understanding tasks; decoder-only (GPT) for generation. Transformers scale better with data and compute, enabling today's LLMs.",
  },
];

export const codingPrompts: CodingPrompt[] = [
  // === COLLECTIONS ===
  {
    id: "cp-col-1",
    topic: "Collections",
    difficulty: "Medium",
    title: "Implement LRU Cache",
    description: "Design and implement an LRU (Least Recently Used) cache with O(1) get and put operations. The cache should have a fixed capacity, and when adding a new element beyond capacity, the least recently used element should be evicted.",
    constraints: [
      "get(key) returns value if key exists, -1 otherwise",
      "put(key, value) inserts or updates the key-value pair",
      "Both operations must be O(1)",
      "When capacity is exceeded, evict the LRU element",
    ],
    starterCode: `class LRUCache {
    private final int capacity;

    public LRUCache(int capacity) {
        this.capacity = capacity;
        // TODO: Initialize data structures
    }

    public int get(int key) {
        // TODO: Implement
        return -1;
    }

    public void put(int key, int value) {
        // TODO: Implement
    }
}`,
    hints: [
      "Use a HashMap for O(1) lookups and a doubly-linked list for O(1) removal and insertion",
      "The head of the list represents most recently used, tail is least recently used",
      "On get or put, move the accessed node to the head of the list",
      "Java's LinkedHashMap with accessOrder=true can simplify this — but implement it from scratch to show understanding",
    ],
  },
  {
    id: "cp-col-2",
    topic: "Collections",
    difficulty: "Easy",
    title: "Group Anagrams",
    description: "Given an array of strings, group anagrams together. Two strings are anagrams if they contain the same characters with the same frequencies, regardless of order.",
    constraints: [
      "Input: String[] strs",
      "Output: List<List<String>>",
      "1 <= strs.length <= 10^4",
      "0 <= strs[i].length <= 100",
    ],
    starterCode: `public List<List<String>> groupAnagrams(String[] strs) {
    // TODO: Implement
    return new ArrayList<>();
}`,
    hints: [
      "What would be a good key for grouping? Sorted characters of each word",
      "Use a HashMap<String, List<String>> to group words by their sorted key",
      "Alternative: use a character frequency array as the key for O(n*k) instead of O(n*k*log(k))",
    ],
  },
   {
    id: "cp-col-3",
    topic: "Collections",
    difficulty: "Medium",
    title: "Implement a Custom HashMap",
    description: "Build a simplified HashMap<K, V> from scratch using separate chaining. Implement put(), get(), remove(), and resize() with a load factor threshold. Demonstrate understanding of hashing, collision resolution, and dynamic resizing.",
    constraints: [
      "Initial capacity: 16, load factor: 0.75",
      "Use an array of linked lists (Entry<K,V>) for buckets",
      "resize() should double capacity and rehash all entries",
      "Handle null keys (store in bucket 0)",
    ],
    starterCode: `public class CustomHashMap<K, V> {
    private static final int INITIAL_CAPACITY = 16;
    private static final float LOAD_FACTOR = 0.75f;

    private Entry<K, V>[] buckets;
    private int size;

    static class Entry<K, V> {
        K key; V value; Entry<K, V> next;
        Entry(K key, V value) {
            this.key = key; this.value = value;
        }
    }

    public void put(K key, V value) {
        // TODO: hash key, find bucket, update or insert
    }

    public V get(K key) {
        // TODO: hash key, traverse chain
        return null;
    }

    private void resize() {
        // TODO: double capacity, rehash all entries
    }
}`,
    hints: [
      "int index = (key == null) ? 0 : (key.hashCode() ^ (key.hashCode() >>> 16)) & (capacity - 1)",
      "Traverse the linked list in the bucket to find existing keys with equals()",
      "In resize(), create a new bucket array and re-insert all entries using the new capacity",
      "Increment size only on new insertions, not updates",
    ],
  },
  {
    id: "cp-col-4",
    topic: "Collections",
    difficulty: "Easy",
    title: "Top K Frequent Elements",
    description: "Given an integer array, return the k most frequent elements. If two elements have the same frequency, return either. Aim for better than O(n log n) time complexity.",
    constraints: [
      "Input: int[] nums, int k",
      "Output: int[] of k most frequent elements",
      "1 <= k <= number of unique elements",
      "Aim for O(n) using bucket sort approach",
    ],
    starterCode: `public int[] topKFrequent(int[] nums, int k) {
    // TODO: Count frequencies
    // TODO: Bucket sort by frequency
    // TODO: Collect top k from highest-frequency buckets
    return new int[k];
}`,
    hints: [
      "Use a HashMap<Integer, Integer> to count frequencies",
      "Create a bucket array of size n+1 where bucket[i] = list of numbers with frequency i",
      "Iterate from the highest bucket downward, collecting elements until you have k",
      "This gives O(n) time and O(n) space",
    ],
  },
  {
    id: "cp-col-5",
    topic: "Collections",
    difficulty: "Hard",
    title: "Implement a Skip List",
    description: "Build a Skip List data structure that supports O(log n) average-case search, insert, and delete. The skip list is a probabilistic alternative to balanced BSTs, used internally by Redis Sorted Sets and ConcurrentSkipListMap.",
    constraints: [
      "search(key): returns true if key exists, O(log n) average",
      "insert(key): inserts a key with random level assignment",
      "delete(key): removes key from all levels",
      "Use MAX_LEVEL = 16 and probability P = 0.5 for level generation",
    ],
    starterCode: `public class SkipList {
    private static final int MAX_LEVEL = 16;
    private static final double P = 0.5;
    private final Node head = new Node(Integer.MIN_VALUE, MAX_LEVEL);
    private int level = 1;

    static class Node {
        int key;
        Node[] next;
        Node(int key, int level) {
            this.key = key;
            this.next = new Node[level];
        }
    }

    public boolean search(int key) {
        // TODO: Start from head at highest level,
        // move right while next < key, drop down
        return false;
    }

    public void insert(int key) {
        // TODO: Track update[] nodes at each level
        // Generate random level, link new node
    }

    public void delete(int key) {
        // TODO: Find and unlink node at every level
    }

    private int randomLevel() {
        // TODO: Flip coin MAX_LEVEL times, count heads
        return 1;
    }
}`,
    hints: [
      "search: Node curr = head; for (int i = level-1; i >= 0; i--) { while (curr.next[i] != null && curr.next[i].key < key) curr = curr.next[i]; } return curr.next[0] != null && curr.next[0].key == key",
      "insert: maintain update[i] = the rightmost node at level i that is to the left of the insertion point",
      "randomLevel: int lvl = 1; while (Math.random() < P && lvl < MAX_LEVEL) lvl++; return lvl",
      "After linking new node, update this.level if the new node's level exceeds the current list level",
    ],
  },
  {
    id: "cp-col-6",
    topic: "Collections",
    difficulty: "Medium",
    title: "Flatten a Nested Iterator",
    description: "Implement an iterator that flattens a List<NestedInteger> where each NestedInteger is either a single integer or a list of NestedIntegers. The iterator should lazily produce integers in order via hasNext() and next().",
    constraints: [
      "Implement Iterator<Integer> with hasNext() and next()",
      "Do not pre-flatten the entire structure — use a lazy approach",
      "NestedInteger has: isInteger(), getInteger(), getList()",
      "Input can be arbitrarily deep (nested lists within lists)",
    ],
    starterCode: `public class NestedIterator implements Iterator<Integer> {

    public NestedIterator(List<NestedInteger> nestedList) {
        // TODO: Initialize — consider using a Deque/Stack
    }

    @Override
    public Integer next() {
        // TODO: Return the next integer
        return null;
    }

    @Override
    public boolean hasNext() {
        // TODO: Ensure the front of the queue/stack
        // is an integer (expand lists as needed)
        return false;
    }
}`,
    hints: [
      "Use a Deque<NestedInteger> initialized with the input list elements in order",
      "In hasNext(): while (!deque.isEmpty() && !deque.peek().isInteger()) — pop the head, push its children back to the front",
      "next() just calls hasNext() then deque.poll().getInteger()",
      "This lazy expansion means you never process more than needed — key for infinite/large structures",
    ],
  },

  // === JVM ===
  {
    id: "cp-jvm-1",
    topic: "JVM",
    difficulty: "Medium",
    title: "Memory Leak Detection",
    description: "Given the following code, identify the memory leak and fix it. The code manages a stack of objects but leaks memory when popping elements. Explain why the leak occurs and how to prevent it.",
    constraints: [
      "Identify the exact line(s) causing the memory leak",
      "Fix the code to prevent unintended object retention",
      "Explain the concept of obsolete references",
    ],
    starterCode: `public class LeakyStack {
    private Object[] elements;
    private int size = 0;
    private static final int DEFAULT_CAPACITY = 16;

    public LeakyStack() {
        elements = new Object[DEFAULT_CAPACITY];
    }

    public void push(Object e) {
        ensureCapacity();
        elements[size++] = e;
    }

    public Object pop() {
        if (size == 0) throw new EmptyStackException();
        return elements[--size]; // Memory leak here!
    }

    // Fix this method to eliminate the leak
    // What line should be added?
}`,
    hints: [
      "After decrementing size, the element at index 'size' is an obsolete reference",
      "The GC cannot reclaim the object because the array still references it",
      "Add elements[size] = null after popping to allow garbage collection",
      "This is from Effective Java Item 7: 'Eliminate obsolete object references'",
    ],
  },
   {
    id: "cp-jvm-2",
    topic: "JVM",
    difficulty: "Hard",
    title: "Implement a Custom ClassLoader",
    description: "Build a custom ClassLoader that loads a class from a byte array (simulating loading from an encrypted JAR or a remote source). Implement the parent delegation model correctly and demonstrate dynamic class loading.",
    constraints: [
      "Extend ClassLoader and override findClass()",
      "Use defineClass() to convert bytes to a Class object",
      "Respect parent delegation — check parent first",
      "Demonstrate loading a class and calling a method reflectively",
    ],
    starterCode: `public class ByteArrayClassLoader extends ClassLoader {
    private final Map<String, byte[]> classBytes;

    public ByteArrayClassLoader(
            Map<String, byte[]> classBytes,
            ClassLoader parent) {
        super(parent);
        this.classBytes = classBytes;
    }

    @Override
    protected Class<?> findClass(String name)
            throws ClassNotFoundException {
        // TODO: Look up bytes, call defineClass()
        throw new ClassNotFoundException(name);
    }

    // Usage example:
    // Map<String, byte[]> map = new HashMap<>();
    // map.put("com.example.Hello", readClassBytes());
    // ClassLoader cl = new ByteArrayClassLoader(map, parent);
    // Class<?> clazz = cl.loadClass("com.example.Hello");
    // clazz.getMethod("greet").invoke(clazz.newInstance());
}`,
    hints: [
      "byte[] bytes = classBytes.get(name); if (bytes == null) throw new ClassNotFoundException(name)",
      "return defineClass(name, bytes, 0, bytes.length) to register the class with the JVM",
      "loadClass() in the parent class already implements delegation — only override findClass()",
      "Each ClassLoader instance creates an isolation boundary — two ClassLoaders loading the same class produce incompatible Class objects",
    ],
  },
  {
    id: "cp-jvm-3",
    topic: "JVM",
    difficulty: "Medium",
    title: "Diagnose and Fix a ThreadLocal Memory Leak",
    description: "The following service uses ThreadLocal to cache a non-thread-safe DateFormat. Identify the memory leak, explain why it occurs in a thread pool, and fix it using proper cleanup.",
    constraints: [
      "Identify why ThreadLocal in a thread pool causes a memory leak",
      "Fix using try-finally with ThreadLocal.remove()",
      "Explain the interaction between ThreadLocalMap, thread lifecycle, and GC",
      "Provide an alternative solution using Java 8's DateTimeFormatter",
    ],
    starterCode: `public class DateService {
    // Memory leak: ThreadLocal value is never removed
    private static final ThreadLocal<SimpleDateFormat> formatter =
        ThreadLocal.withInitial(() ->
            new SimpleDateFormat("yyyy-MM-dd"));

    public String format(Date date) {
        // In a Tomcat/Spring thread pool, the thread
        // lives forever — the ThreadLocal value is
        // never garbage collected!
        return formatter.get().format(date);
    }

    // TODO: Add a fixed version that calls remove()
    // TODO: Add a version using DateTimeFormatter
    //       (thread-safe — no ThreadLocal needed)

    public String formatFixed(Date date) {
        // TODO: Implement with proper cleanup
        return "";
    }
}`,
    hints: [
      "Thread pools reuse threads indefinitely — when a thread is returned to the pool, its ThreadLocalMap entry persists until explicitly removed",
      "ThreadLocalMap keys are WeakReferences to the ThreadLocal object, but the VALUES are strong references — this keeps the value alive even if the ThreadLocal is nulled",
      "Fix: try { return formatter.get().format(date); } finally { formatter.remove(); }",
      "Best fix: private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern('yyyy-MM-dd'); — DateTimeFormatter is immutable and thread-safe",
    ],
  },
  {
    id: "cp-jvm-4",
    topic: "JVM",
    difficulty: "Hard",
    title: "Implement a Simple Object Pool",
    description: "Design a generic, thread-safe object pool that pre-creates a fixed number of expensive objects (e.g., DB connections) and lends them out. Objects are returned after use. Handle pool exhaustion by blocking with a timeout.",
    constraints: [
      "Pool is initialized with N pre-created objects",
      "borrow(timeout, unit) returns an object or throws if timeout exceeded",
      "release(obj) returns the object to the pool",
      "Pool must be thread-safe for concurrent borrowers",
    ],
    starterCode: `public class ObjectPool<T> {
    private final BlockingQueue<T> pool;
    private final Supplier<T> factory;

    public ObjectPool(int size, Supplier<T> factory) {
        this.factory = factory;
        this.pool = new ArrayBlockingQueue<>(size);
        // TODO: Pre-populate the pool with 'size' objects
    }

    public T borrow(long timeout, TimeUnit unit)
            throws InterruptedException {
        // TODO: Poll with timeout, throw if null
        return null;
    }

    public void release(T obj) {
        // TODO: Return object to pool
        // Consider: what if obj is null or corrupted?
    }

    public void shutdown(Consumer<T> destroyer) {
        // TODO: Drain pool and destroy all objects
    }
}`,
    hints: [
      "In constructor: for (int i = 0; i < size; i++) pool.offer(factory.get())",
      "borrow: T obj = pool.poll(timeout, unit); if (obj == null) throw new TimeoutException('Pool exhausted'); return obj",
      "release: if (obj != null) pool.offer(obj) — offer is non-blocking; if pool is full, discard (shouldn't happen in a fixed pool)",
      "For a try-with-resources pattern, have T implement AutoCloseable and call pool.release(this) in close()",
    ],
  },

  // === CONCURRENCY ===
  {
    id: "cp-con-1",
    topic: "Concurrency",
    difficulty: "Hard",
    title: "Implement a Thread-Safe Bounded Queue",
    description: "Implement a bounded blocking queue that supports multiple producers and consumers. The queue should block producers when full and block consumers when empty, using wait/notify or ReentrantLock/Condition.",
    constraints: [
      "enqueue(T item) blocks if queue is full",
      "dequeue() blocks if queue is empty and returns the item",
      "Must be thread-safe for multiple producers and consumers",
      "Must not use java.util.concurrent blocking queues",
    ],
    starterCode: `public class BoundedBlockingQueue<T> {
    private final Object[] buffer;
    private int head, tail, count;

    public BoundedBlockingQueue(int capacity) {
        buffer = new Object[capacity];
    }

    public synchronized void enqueue(T item)
        throws InterruptedException {
        // TODO: Block while full, then add item
    }

    @SuppressWarnings("unchecked")
    public synchronized T dequeue()
        throws InterruptedException {
        // TODO: Block while empty, then remove item
    }
}`,
    hints: [
      "Use while loops (not if) for wait conditions to handle spurious wakeups",
      "Call wait() when the queue is full (for enqueue) or empty (for dequeue)",
      "Call notifyAll() after adding or removing an element",
      "For a ReentrantLock version, use two Conditions: notFull and notEmpty for better precision",
    ],
  },
  {
    id: "cp-con-2",
    topic: "Concurrency",
    difficulty: "Medium",
    title: "Implement a Thread-Safe Singleton",
    description: "Implement the Singleton pattern that is both lazy-initialized and thread-safe, using three different approaches: double-checked locking, Bill Pugh holder, and enum singleton. Compare their trade-offs.",
    constraints: [
      "Instance must be lazily initialized (not created until first access)",
      "Must be safe for concurrent access",
      "Show three different approaches with trade-offs",
    ],
    starterCode: `// Approach 1: Double-Checked Locking
public class Singleton {
    private static volatile Singleton instance;

    private Singleton() {}

    public static Singleton getInstance() {
        // TODO: Implement double-checked locking
        return instance;
    }
}

// Approach 2: Bill Pugh Holder Pattern
// TODO: Implement using a static inner class

// Approach 3: Enum Singleton
// TODO: Implement using an enum`,
    hints: [
      "In double-checked locking, the volatile keyword is essential — without it, a partially constructed object might be visible to another thread",
      "Bill Pugh pattern uses a static inner class that is loaded only when getInstance() is called",
      "Enum singleton is the simplest and provides serialization safety for free",
      "Consider: which approach handles serialization attacks and reflection attacks?",
    ],
  },
  {
    id: "cp-con-3",
    topic: "Concurrency",
    difficulty: "Medium",
    title: "Producer-Consumer with CompletableFuture",
    description: "Implement an async pipeline: a producer generates tasks, a processing stage transforms them, and a consumer aggregates results. Use CompletableFuture chaining with a custom thread pool. Handle errors gracefully.",
    constraints: [
      "Producer generates List<Integer> of work items",
      "Processing stage squares each number (simulates slow async work)",
      "Consumer sums all results",
      "Use supplyAsync, thenApplyAsync, and exceptionally",
    ],
    starterCode: `public class AsyncPipeline {
    private final ExecutorService executor =
        Executors.newFixedThreadPool(4);

    public CompletableFuture<Long> process(
            List<Integer> items) {
        // TODO: For each item, create a CompletableFuture
        // that squares it asynchronously
        // TODO: Combine all futures and sum results
        // TODO: Handle exceptions with fallback value 0
        return CompletableFuture.completedFuture(0L);
    }

    // Hint: Use CompletableFuture.allOf() with
    // a stream of individual futures
}`,
    hints: [
      "Stream items into CompletableFuture.supplyAsync(() -> (long) item * item, executor)",
      "Collect into List<CompletableFuture<Long>> then use CompletableFuture.allOf(futures.toArray(...))",
      "After allOf().join(), stream futures with .join() to collect results and sum",
      "Chain .exceptionally(ex -> 0L) on each future to handle per-item failures",
    ],
  },
  {
    id: "cp-con-4",
    topic: "Concurrency",
    difficulty: "Hard",
    title: "Implement a ReadWriteLock from Scratch",
    description: "Implement a ReadWriteLock that allows multiple concurrent readers or a single exclusive writer. Readers must wait if a writer holds the lock; writers must wait for all readers and any other writer to release.",
    constraints: [
      "readLock(): multiple threads can hold simultaneously",
      "writeLock(): exclusive — blocks all readers and other writers",
      "readUnlock() and writeUnlock() must update state correctly",
      "Must not use java.util.concurrent.locks.ReadWriteLock",
    ],
    starterCode: `public class SimpleReadWriteLock {
    private int readers = 0;
    private int writers = 0;
    private int writeRequests = 0;

    public synchronized void readLock()
            throws InterruptedException {
        // TODO: Wait while there are writers or
        // pending write requests (to avoid writer starvation)
    }

    public synchronized void readUnlock() {
        // TODO: Decrement readers, notifyAll if needed
    }

    public synchronized void writeLock()
            throws InterruptedException {
        // TODO: Increment writeRequests, wait until
        // no readers and no active writers
    }

    public synchronized void writeUnlock() {
        // TODO: Decrement writers/writeRequests, notifyAll
    }
}`,
    hints: [
      "readLock: while (writers > 0 || writeRequests > 0) wait(); readers++",
      "writeLock: writeRequests++; while (readers > 0 || writers > 0) wait(); writeRequests--; writers++",
      "Always use while (condition) wait() — not if — to guard against spurious wakeups",
      "Call notifyAll() in both unlock methods since both readers and writers may be waiting",
    ],
  },
  {
    id: "cp-con-5",
    topic: "Concurrency",
    difficulty: "Medium",
    title: "Parallel Merge Sort Using ForkJoinPool",
    description: "Implement a parallel merge sort using the ForkJoinPool framework. The array should be split recursively into sub-tasks below a threshold, sorted in parallel, then merged. Compare its performance approach to sequential merge sort.",
    constraints: [
      "Extend RecursiveAction (void) for the sort task",
      "Use a SEQUENTIAL_THRESHOLD (e.g., 1000) below which Arrays.sort() is used",
      "Fork the left half, compute the right half directly, then join left",
      "Merge the two sorted halves back into the original array",
    ],
    starterCode: `public class ParallelMergeSort
        extends RecursiveAction {

    private final int[] arr;
    private final int left, right;
    private static final int THRESHOLD = 1000;

    public ParallelMergeSort(int[] arr,
            int left, int right) {
        this.arr = arr;
        this.left = left;
        this.right = right;
    }

    @Override
    protected void compute() {
        if (right - left <= THRESHOLD) {
            // TODO: Use Arrays.sort for small arrays
            return;
        }
        int mid = (left + right) / 2;
        // TODO: Fork left half, compute right half,
        // join left, then merge
    }

    private void merge(int left, int mid, int right) {
        // TODO: Standard in-place merge
    }

    public static void sort(int[] arr) {
        ForkJoinPool.commonPool().invoke(
            new ParallelMergeSort(arr, 0, arr.length - 1));
    }
}`,
    hints: [
      "ParallelMergeSort leftTask = new ParallelMergeSort(arr, left, mid); leftTask.fork(); new ParallelMergeSort(arr, mid+1, right).compute(); leftTask.join();",
      "Fork left, compute right directly (avoids creating an extra thread for one half — a key ForkJoin optimization)",
      "merge(): copy both halves to temp arrays, then merge back with two pointers",
      "The threshold avoids fork overhead for small arrays — tuning it is key for performance",
    ],
  },

  // === SPRING BOOT ===
  {
    id: "cp-sb-1",
    topic: "Spring Boot",
    difficulty: "Medium",
    title: "Design a REST API with Proper Exception Handling",
    description: "Create a Spring Boot REST controller for a Product CRUD API with global exception handling using @ControllerAdvice. Implement proper HTTP status codes, validation, and a consistent error response structure.",
    constraints: [
      "GET /api/products, GET /api/products/{id}, POST, PUT, DELETE",
      "Use @Valid with Bean Validation annotations",
      "Return appropriate HTTP status codes (200, 201, 204, 400, 404)",
      "Use @ControllerAdvice for global exception handling",
    ],
    starterCode: `@RestController
@RequestMapping("/api/products")
public class ProductController {

    // TODO: Inject service

    @GetMapping("/{id}")
    public ResponseEntity<Product> getById(
            @PathVariable Long id) {
        // TODO: Return 200 or 404
    }

    @PostMapping
    public ResponseEntity<Product> create(
            @Valid @RequestBody ProductDTO dto) {
        // TODO: Return 201 with location header
    }
}

@ControllerAdvice
public class GlobalExceptionHandler {
    // TODO: Handle MethodArgumentNotValidException
    // TODO: Handle ResourceNotFoundException
    // TODO: Return consistent error response
}`,
    hints: [
      "Use ResponseEntity.created(URI) for POST responses with Location header",
      "In @ControllerAdvice, use @ExceptionHandler(MethodArgumentNotValidException.class) for validation errors",
      "Create a custom ApiErrorResponse DTO with timestamp, status, message, and field errors",
      "ResponseEntity.notFound() for 404, ResponseEntity.noContent() for successful DELETE",
    ],
  },
  {
    id: "cp-sb-2",
    topic: "Spring Boot",
    difficulty: "Hard",
    title: "Implement a Custom Spring Boot Auto-Configuration",
    description: "Create a custom Spring Boot starter that auto-configures an AuditService bean only when a specific property is enabled and no existing AuditService bean is present. Include a spring.factories registration.",
    constraints: [
      "Auto-configuration class uses @ConditionalOnProperty and @ConditionalOnMissingBean",
      "Register in META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports",
      "AuditService logs method names and timestamps",
      "Provide @ConfigurationProperties for customization",
    ],
    starterCode: `@AutoConfiguration
@ConditionalOnProperty(
    prefix = "audit",
    name = "enabled",
    havingValue = "true"
)
public class AuditAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean
    public AuditService auditService(
            AuditProperties props) {
        // TODO: Return configured AuditService
        return null;
    }

    @Bean
    @ConditionalOnMissingBean
    public AuditProperties auditProperties() {
        return new AuditProperties();
    }
}

@ConfigurationProperties(prefix = "audit")
public class AuditProperties {
    private boolean enabled;
    private String logLevel = "INFO";
    // TODO: Getters and setters
}`,
    hints: [
      "Create META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports with the FQCN of your auto-config class",
      "Use @EnableConfigurationProperties(AuditProperties.class) on the auto-configuration class",
      "AuditService can use a Logger internally; the log level is read from AuditProperties",
      "Write a @SpringBootTest that verifies the bean is absent when audit.enabled=false and present when true",
    ],
  },
   {
    id: "cp-sb-3",
    topic: "Spring Boot",
    difficulty: "Medium",
    title: "Implement a Rate Limiting Interceptor",
    description: "Build a Spring MVC HandlerInterceptor that rate-limits requests per API key. Use a ConcurrentHashMap with token bucket logic to allow 100 requests/minute per key. Return HTTP 429 when the limit is exceeded.",
    constraints: [
      "Extract API key from X-API-Key request header",
      "Allow 100 requests per 60-second window per key",
      "Return 429 Too Many Requests with Retry-After header",
      "Register the interceptor in a WebMvcConfigurer",
    ],
    starterCode: `@Component
public class RateLimitInterceptor implements HandlerInterceptor {

    private final ConcurrentHashMap<String, TokenBucket>
        buckets = new ConcurrentHashMap<>();

    @Override
    public boolean preHandle(HttpServletRequest req,
            HttpServletResponse res, Object handler)
            throws Exception {
        String apiKey = req.getHeader("X-API-Key");
        if (apiKey == null) {
            res.setStatus(401);
            return false;
        }
        // TODO: Get or create bucket for apiKey
        // TODO: If bucket.tryConsume() returns false,
        //       set 429 + Retry-After header and return false
        return true;
    }
}

class TokenBucket {
    private final int capacity;
    private final long refillIntervalMs;
    private int tokens;
    private long lastRefillTime;

    public TokenBucket(int capacity,
            long refillIntervalMs) {
        // TODO: Initialize
    }

    public synchronized boolean tryConsume() {
        // TODO: Refill if interval elapsed, consume 1 token
        return false;
    }
}`,
    hints: [
      "buckets.computeIfAbsent(apiKey, k -> new TokenBucket(100, 60_000))",
      "In tryConsume: long now = System.currentTimeMillis(); if (now - lastRefillTime >= refillIntervalMs) { tokens = capacity; lastRefillTime = now; }",
      "if (tokens > 0) { tokens--; return true; } return false",
      "Register with: @Configuration public class WebConfig implements WebMvcConfigurer { @Override public void addInterceptors(InterceptorRegistry r) { r.addInterceptor(rateLimitInterceptor).addPathPatterns('/api/**'); } }",
    ],
  },
  {
    id: "cp-sb-4",
    topic: "Spring Boot",
    difficulty: "Hard",
    title: "Implement Event-Driven Audit Logging with Spring Events",
    description: "Design an audit logging system using Spring's ApplicationEventPublisher. Domain operations publish AuditEvent objects; an async listener persists them to the database. Ensure events are not lost on publisher failure using a transactional event listener.",
    constraints: [
      "AuditEvent carries: userId, action, entityType, entityId, timestamp",
      "Use @TransactionalEventListener(phase = AFTER_COMMIT) for persistence safety",
      "Listener must be @Async to avoid slowing down the main transaction",
      "If the listener fails, log the error but don't roll back the main transaction",
    ],
    starterCode: `// Event class
public class AuditEvent extends ApplicationEvent {
    private final String userId, action,
        entityType, entityId;
    // TODO: Constructor and getters
}

// Publisher — inject into service classes
@Component
public class AuditPublisher {
    private final ApplicationEventPublisher publisher;

    public void publish(String userId, String action,
            String entityType, String entityId) {
        // TODO: Create and publish AuditEvent
    }
}

// Listener
@Component
public class AuditEventListener {
    private final AuditLogRepository repo;

    @Async
    @TransactionalEventListener(
        phase = TransactionPhase.AFTER_COMMIT)
    public void handleAuditEvent(AuditEvent event) {
        // TODO: Persist to audit_log table
        // TODO: Catch exceptions — never propagate
    }
}

// Enable async in main config:
// @EnableAsync on a @Configuration class`,
    hints: [
      "@TransactionalEventListener fires only AFTER the publishing transaction commits — guarantees the main entity is already saved",
      "Without @Async, the listener runs in the publisher's thread, adding latency to every transactional method",
      "Wrap the listener body in try-catch and log failures — propagating would cause unintended behavior since the main TX is already committed",
      "For guaranteed delivery (no event loss), consider the Outbox Pattern instead of in-process events",
    ],
  },

  // === MICROSERVICES ===
  {
    id: "cp-ms-1",
    topic: "Microservices",
    difficulty: "Medium",
    title: "Implement Service Discovery with Health Checks",
    description: "Design a simple in-memory service registry that supports registering services, heartbeat-based health checks, and returning healthy instances for client-side load balancing.",
    constraints: [
      "Services register with name, host, port",
      "Services send heartbeats every N seconds",
      "Registry removes services that miss K consecutive heartbeats",
      "getInstances(serviceName) returns only healthy instances",
    ],
    starterCode: `public class ServiceRegistry {
    // TODO: Choose appropriate data structure

    public void register(String name, String host,
                         int port) {
        // TODO: Register a new service instance
    }

    public void heartbeat(String instanceId) {
        // TODO: Update last heartbeat timestamp
    }

    public List<ServiceInstance> getInstances(
            String serviceName) {
        // TODO: Return only healthy instances
    }

    // TODO: Background cleanup thread for
    // expired instances
}`,
    hints: [
      "Use ConcurrentHashMap<String, Set<ServiceInstance>> for thread safety",
      "ServiceInstance stores: id, name, host, port, lastHeartbeat timestamp",
      "A ScheduledExecutorService can run periodic cleanup of expired instances",
      "Consider using a ReadWriteLock if cleanup and registration happen concurrently",
    ],
  },
  {
    id: "cp-ms-2",
    topic: "Microservices",
    difficulty: "Hard",
    title: "Implement the Outbox Pattern",
    description: "Implement the Transactional Outbox Pattern in a Spring Boot service. When saving an Order, atomically write an OrderCreatedEvent to an outbox table within the same transaction. A scheduler polls and publishes pending events.",
    constraints: [
      "Order save and outbox event write must be in a single @Transactional method",
      "OutboxEvent table: id, aggregate_type, aggregate_id, event_type, payload (JSON), published (boolean)",
      "A @Scheduled poller reads unpublished events and sends them to Kafka",
      "Mark events as published after successful Kafka send",
    ],
    starterCode: `@Service
public class OrderService {
    private final OrderRepository orderRepo;
    private final OutboxEventRepository outboxRepo;
    private final ObjectMapper mapper;

    @Transactional
    public Order createOrder(OrderRequest req) {
        Order order = orderRepo.save(
            new Order(req));
        // TODO: Create and save OutboxEvent
        //       with order data as JSON payload
        return order;
    }
}

@Component
public class OutboxEventPublisher {
    private final OutboxEventRepository outboxRepo;
    private final KafkaTemplate<String, String> kafka;

    @Scheduled(fixedDelay = 1000)
    @Transactional
    public void publishPendingEvents() {
        // TODO: Find unpublished events
        // TODO: Send to Kafka topic
        // TODO: Mark as published
    }
}`,
    hints: [
      "OutboxEvent entity: @Entity with published=false default, createdAt timestamp",
      "outboxRepo.save(new OutboxEvent('Order', order.getId(), 'ORDER_CREATED', mapper.writeValueAsString(order)))",
      "In publisher: List<OutboxEvent> events = outboxRepo.findByPublishedFalse()",
      "After kafkaTemplate.send(...).get() (sync), set event.setPublished(true) — the @Transactional will commit both",
    ],
  },
  {
    id: "cp-ms-3",
    topic: "Microservices",
    difficulty: "Medium",
    title: "Implement a Circuit Breaker",
    description: "Build a simplified Circuit Breaker with CLOSED, OPEN, and HALF_OPEN states. It wraps a Supplier<T> and tracks the failure rate over a sliding window. Transition to OPEN when failures exceed a threshold; probe with a single request after a wait period.",
    constraints: [
      "States: CLOSED (pass-through), OPEN (fail-fast), HALF_OPEN (trial request)",
      "Transition to OPEN when failure rate > 50% over last 10 calls",
      "After OPEN for 5 seconds, allow 1 trial request (HALF_OPEN)",
      "On trial success -> CLOSED; on trial failure -> back to OPEN",
    ],
    starterCode: `public class CircuitBreaker {
    enum State { CLOSED, OPEN, HALF_OPEN }

    private State state = State.CLOSED;
    private int failureCount = 0;
    private int requestCount = 0;
    private long openedAt = 0;

    private static final int WINDOW = 10;
    private static final double THRESHOLD = 0.5;
    private static final long WAIT_MS = 5000;

    public <T> T execute(Supplier<T> supplier) {
        // TODO: Check state
        // If OPEN: check if wait period passed -> HALF_OPEN
        //          else throw CircuitOpenException
        // If HALF_OPEN: try one request, transition on result
        // If CLOSED: call supplier, track success/failure
        return null;
    }

    private void recordSuccess() {
        // TODO: Reset counts, stay/move to CLOSED
    }

    private void recordFailure() {
        // TODO: Increment counts, check threshold -> OPEN
    }
}`,
    hints: [
      "In OPEN state: if (System.currentTimeMillis() - openedAt >= WAIT_MS) state = HALF_OPEN; else throw new CircuitOpenException()",
      "recordFailure: failureCount++; requestCount++; if (requestCount >= WINDOW && (double)failureCount/requestCount > THRESHOLD) { state = OPEN; openedAt = now; }",
      "recordSuccess: failureCount = 0; requestCount = 0; state = CLOSED",
      "For HALF_OPEN: use a try-catch around supplier.get() — success -> recordSuccess, failure -> state = OPEN; openedAt = now",
    ],
  },
  {
    id: "cp-ms-4",
    topic: "Microservices",
    difficulty: "Hard",
    title: "Implement Distributed Tracing Context Propagation",
    description: "Implement trace context propagation across service boundaries using a ThreadLocal trace context. Simulate a chain of service calls where traceId is passed via HTTP headers (X-Trace-Id, X-Span-Id) and logged with every operation.",
    constraints: [
      "TraceContext holds: traceId (UUID), spanId (UUID), parentSpanId",
      "TraceContextHolder uses InheritableThreadLocal for async propagation",
      "A Spring Filter extracts traceId from incoming headers or generates a new one",
      "Each outbound RestTemplate call injects the current context into headers",
    ],
    starterCode: `public class TraceContext {
    private final String traceId;
    private final String spanId;
    private final String parentSpanId;
    // Constructor, getters, and newChildSpan() method
}

public class TraceContextHolder {
    private static final InheritableThreadLocal<TraceContext>
        context = new InheritableThreadLocal<>();

    public static TraceContext get() { return context.get(); }
    public static void set(TraceContext ctx) { context.set(ctx); }
    public static void clear() { context.remove(); }
}

@Component
public class TraceFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest req,
            HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        // TODO: Extract or generate traceId
        // TODO: Set TraceContext in holder
        // TODO: Add traceId to MDC for logging
        try {
            chain.doFilter(req, res);
        } finally {
            // TODO: Clear context and MDC
        }
    }
}

@Bean
public RestTemplate restTemplate() {
    RestTemplate rt = new RestTemplate();
    // TODO: Add ClientHttpRequestInterceptor that
    // injects TraceContext headers on each outbound call
    return rt;
}`,
    hints: [
      "Extract: String traceId = req.getHeader('X-Trace-Id'); if (traceId == null) traceId = UUID.randomUUID().toString()",
      "MDC.put('traceId', traceId) enables automatic inclusion in log patterns with %X{traceId}",
      "RestTemplate interceptor: request.getHeaders().set('X-Trace-Id', TraceContextHolder.get().getTraceId())",
      "InheritableThreadLocal propagates context to child threads created by the same parent — important for CompletableFuture.supplyAsync()",
    ],
  },
  

  // === DATABASE DESIGN ===
  {
    id: "cp-db-1",
    topic: "Database Design",
    difficulty: "Medium",
    title: "Design Schema for an E-Commerce System",
    description: "Design a normalized database schema for an e-commerce platform. Include tables for users, products, orders, order items, categories, and reviews. Define primary keys, foreign keys, indexes, and explain your indexing strategy.",
    constraints: [
      "Support many-to-many: products can belong to multiple categories",
      "An order can have multiple items with different quantities",
      "Users can review products (one review per user per product)",
      "Include appropriate indexes for common query patterns",
    ],
    starterCode: `-- TODO: Design the schema

-- Users table
CREATE TABLE users (
    -- Define columns and constraints
);

-- Products table

-- Categories table

-- Product_Categories junction table

-- Orders table

-- Order_Items table

-- Reviews table

-- Define indexes for these query patterns:
-- 1. Find all products in a category
-- 2. Get all orders for a user sorted by date
-- 3. Find top-rated products
-- 4. Get order details with product info`,
    hints: [
      "Use a junction table product_categories for the many-to-many relationship",
      "Order_items has a composite foreign key (order_id, product_id) with quantity and unit_price (snapshot the price at order time)",
      "Add a unique constraint on reviews(user_id, product_id) to enforce one review per user per product",
      "Index foreign keys (user_id on orders, product_id on order_items) and commonly filtered columns (category_id, status)",
    ],
  },
  {
    id: "cp-db-2",
    topic: "Database Design",
    difficulty: "Hard",
    title: "Design a Time-Series Schema and Query Optimization",
    description: "Design a PostgreSQL schema for storing IoT sensor readings (device_id, metric_name, value, timestamp) at 1M writes/minute. Optimize for the most common query: 'Get average temperature for device X over the last 24 hours, grouped by hour.'",
    constraints: [
      "Table must support 1M inserts/minute",
      "Primary query: range scan + group-by-hour aggregation",
      "Old data (> 90 days) should be archived automatically",
      "Schema should use table partitioning",
    ],
    starterCode: `-- Design the sensor_readings table
-- Use time-based partitioning (PARTITION BY RANGE)

CREATE TABLE sensor_readings (
    -- TODO: Define columns
    -- TODO: Define partition key
) PARTITION BY RANGE (/* TODO */);

-- Create monthly partitions
-- CREATE TABLE sensor_readings_2024_01
--   PARTITION OF sensor_readings
--   FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- Define indexes for the primary query pattern

-- Write the optimized query:
-- Average temperature per hour for device 'sensor-001'
-- over the last 24 hours`,
    hints: [
      "Partition by timestamp (monthly or weekly) to enable partition pruning on range queries",
      "Composite index on (device_id, metric_name, timestamp DESC) covers the WHERE and ORDER BY clauses",
      "Use TimescaleDB hypertables for automatic partitioning and built-in time_bucket() for grouping",
      "For automated archival, use pg_partman to create/drop partitions, or a cron job that detaches old partitions",
    ],
  },


  {
    id: "cp-db-3",
    topic: "Database Design",
    difficulty: "Medium",
    title: "Implement a Simple Connection Pool",
    description: "Build a minimal JDBC connection pool that manages a fixed set of database connections, lends them out, and returns them on close(). Connections should be validated before being lent out and the pool should be thread-safe.",
    constraints: [
      "Pool pre-creates N connections using a JDBC URL, user, and password",
      "getConnection() blocks until one is available (with a 5-second timeout)",
      "Connection is auto-returned when close() is called (use a proxy)",
      "Validate connections with isValid(timeout) before lending",
    ],
    starterCode: `public class SimpleConnectionPool {
    private final BlockingQueue<Connection> pool;
    private final String url, user, password;

    public SimpleConnectionPool(String url, String user,
            String password, int poolSize)
            throws SQLException {
        this.url = url; this.user = user;
        this.password = password;
        pool = new ArrayBlockingQueue<>(poolSize);
        // TODO: Pre-fill pool with poolSize connections
    }

    public Connection getConnection()
            throws SQLException, InterruptedException {
        // TODO: Poll with 5-second timeout
        // TODO: Validate connection; if stale, replace it
        // TODO: Return a proxy that returns the real
        //       connection to pool on close()
        return null;
    }

    private Connection createConnection()
            throws SQLException {
        return DriverManager.getConnection(
            url, user, password);
    }

    public void shutdown() {
        // TODO: Close all pooled connections
    }
}`,
    hints: [
      "Connection conn = pool.poll(5, TimeUnit.SECONDS); if (conn == null) throw new SQLException('Pool timeout')",
      "Validate: if (!conn.isValid(1)) { conn.close(); conn = createConnection(); }",
      "Proxy with Java dynamic proxy: return a Connection proxy where close() calls pool.offer(realConnection) instead of closing it",
      "For the proxy: (Connection) Proxy.newProxyInstance(cl, new Class[]{Connection.class}, (p, m, a) -> m.getName().equals('close') ? { pool.offer(conn); return null; } : m.invoke(conn, a))",
    ],
  },
  {
    id: "cp-db-4",
    topic: "Database Design",
    difficulty: "Hard",
    title: "Implement Optimistic Locking with Version Check",
    description: "Implement optimistic locking for a bank account transfer without using database-level SELECT FOR UPDATE. Use a version column to detect concurrent modifications and retry the transaction on conflict.",
    constraints: [
      "Account table has: id, balance, version (long)",
      "UPDATE accounts SET balance=?, version=version+1 WHERE id=? AND version=?",
      "If update affects 0 rows, a concurrent modification occurred — retry",
      "Implement with retry logic (max 3 attempts with backoff)",
    ],
    starterCode: `@Service
public class AccountService {
    private final JdbcTemplate jdbc;
    private static final int MAX_RETRIES = 3;

    @Transactional
    public void transfer(long fromId, long toId,
            BigDecimal amount) {
        for (int attempt = 0; attempt < MAX_RETRIES;
                attempt++) {
            try {
                attemptTransfer(fromId, toId, amount);
                return; // success
            } catch (OptimisticLockException e) {
                if (attempt == MAX_RETRIES - 1)
                    throw e;
                // TODO: Exponential backoff before retry
            }
        }
    }

    private void attemptTransfer(long fromId, long toId,
            BigDecimal amount) {
        // TODO: Read both accounts (id, balance, version)
        // TODO: Validate sufficient balance
        // TODO: Update FROM account with version check
        // TODO: Update TO account with version check
        // TODO: Throw OptimisticLockException if
        //       either update returns rowsAffected == 0
    }
}`,
    hints: [
      "Read: Account a = jdbc.queryForObject('SELECT id, balance, version FROM accounts WHERE id=?', accountMapper, id)",
      "Update: int rows = jdbc.update('UPDATE accounts SET balance=?, version=version+1 WHERE id=? AND version=?', newBalance, id, currentVersion)",
      "if (rows == 0) throw new OptimisticLockException('Concurrent modification on account ' + id)",
      "Backoff: Thread.sleep((long) Math.pow(2, attempt) * 100) — 100ms, 200ms, 400ms",
    ],
  },

  // === SYSTEM DESIGN ===
  {
    id: "cp-sd-1",
    topic: "System Design",
    difficulty: "Hard",
    title: "Design a URL Shortener Service",
    description: "Implement the core logic of a URL shortener service. Write the encoding/decoding logic, the storage interface, and a simple redirect handler. Focus on the Base62 encoding approach and collision handling.",
    constraints: [
      "Generate short codes using Base62 encoding (a-z, A-Z, 0-9)",
      "Support custom aliases",
      "Handle 1000 writes/sec and 100K reads/sec",
      "Short codes should be 6-8 characters",
    ],
    starterCode: `public class URLShortenerService {
    private static final String BASE62 =
        "abcdefghijklmnopqrstuvwxyz" +
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
        "0123456789";

    public String encode(long id) {
        // TODO: Convert numeric ID to Base62 string
        return "";
    }

    public long decode(String shortCode) {
        // TODO: Convert Base62 string back to ID
        return 0;
    }

    public String createShortURL(String longURL,
            String customAlias) {
        // TODO: Generate or validate short code
        // TODO: Store the mapping
        return "";
    }

    public String resolve(String shortCode) {
        // TODO: Look up and return original URL
        // TODO: Consider caching strategy
        return "";
    }
}`,
    hints: [
      "For encode: repeatedly divide by 62 and map remainders to BASE62 characters",
      "Use an AtomicLong or distributed ID generator (Snowflake) for unique IDs",
      "Cache resolved URLs with TTL to handle the 100:1 read:write ratio",
      "For custom aliases, check uniqueness before storing",
    ],
  },

  {
    id: "cp-sd-2",
    topic: "System Design",
    difficulty: "Medium",
    title: "Implement a Consistent Hash Ring",
    description: "Implement a consistent hashing ring used in distributed caches and load balancers. Support adding/removing nodes with virtual nodes to improve distribution. Implement getNode(key) to route a key to the correct node.",
    constraints: [
      "Use a TreeMap<Integer, String> (hash -> node) as the ring",
      "Each node is represented by N virtual nodes (e.g., N=150)",
      "addNode(node) and removeNode(node) must update virtual nodes",
      "getNode(key) returns the first node clockwise from the key's hash",
    ],
    starterCode: `public class ConsistentHashRing {
    private final TreeMap<Integer, String> ring =
        new TreeMap<>();
    private final int virtualNodes;

    public ConsistentHashRing(int virtualNodes) {
        this.virtualNodes = virtualNodes;
    }

    public void addNode(String node) {
        // TODO: Add virtualNodes entries to ring
        // key: hash("node-i"), value: node
    }

    public void removeNode(String node) {
        // TODO: Remove all virtual node entries
    }

    public String getNode(String key) {
        // TODO: Hash the key, find ceiling entry
        // If none found, wrap around to first entry
        return null;
    }

    private int hash(String key) {
        return key.hashCode() & 0x7FFFFFFF;
    }
}`,
    hints: [
      "For addNode: for (int i = 0; i < virtualNodes; i++) ring.put(hash(node + '-' + i), node)",
      "For removeNode: iterate i from 0 to virtualNodes, ring.remove(hash(node + '-' + i))",
      "For getNode: Map.Entry<Integer, String> entry = ring.ceilingEntry(hash(key)); return entry != null ? entry.getValue() : ring.firstEntry().getValue()",
      "More virtual nodes = more even distribution at the cost of memory in the TreeMap",
    ],
  },

  {
    id: "cp-sd-3",
    topic: "System Design",
    difficulty: "Hard",
    title: "Implement a Distributed ID Generator (Snowflake)",
    description: "Implement Twitter's Snowflake ID generation algorithm that produces unique, sortable 64-bit IDs suitable for distributed systems. The ID encodes timestamp, datacenter ID, machine ID, and a sequence number.",
    constraints: [
      "64-bit ID layout: 1 sign bit | 41 bits timestamp (ms) | 5 bits datacenter | 5 bits machine | 12 bits sequence",
      "IDs must be monotonically increasing within the same ms",
      "Handle clock drift — throw if system clock moves backward",
      "Support up to 4096 IDs/ms per machine",
    ],
    starterCode: `public class SnowflakeIdGenerator {
    private static final long EPOCH =
        1609459200000L; // 2021-01-01 UTC

    private static final long DC_BITS = 5;
    private static final long MACHINE_BITS = 5;
    private static final long SEQUENCE_BITS = 12;

    private static final long MAX_SEQUENCE =
        ~(-1L << SEQUENCE_BITS); // 4095

    private final long datacenterId;
    private final long machineId;
    private long sequence = 0L;
    private long lastTimestamp = -1L;

    public SnowflakeIdGenerator(long datacenterId,
            long machineId) {
        // TODO: Validate ranges, assign fields
    }

    public synchronized long nextId() {
        long timestamp = currentMs();
        // TODO: Handle clock going backward
        // TODO: If same ms, increment sequence
        //       If sequence overflows, wait for next ms
        // TODO: Update lastTimestamp
        // TODO: Compose and return the 64-bit ID
        return 0L;
    }

    private long waitForNextMs(long lastTs) {
        // TODO: Busy-wait until currentMs() > lastTs
        return currentMs();
    }

    private long currentMs() {
        return System.currentTimeMillis() - EPOCH;
    }
}`,
    hints: [
      "Clock backward: if (timestamp < lastTimestamp) throw new RuntimeException('Clock moved backwards by ' + (lastTimestamp - timestamp) + 'ms')",
      "Same ms: if (timestamp == lastTimestamp) { sequence = (sequence + 1) & MAX_SEQUENCE; if (sequence == 0) timestamp = waitForNextMs(lastTimestamp); }",
      "Different ms: sequence = 0",
      "Compose: return (timestamp << (DC_BITS + MACHINE_BITS + SEQUENCE_BITS)) | (datacenterId << (MACHINE_BITS + SEQUENCE_BITS)) | (machineId << SEQUENCE_BITS) | sequence",
    ],
  },
  {
    id: "cp-sd-4",
    topic: "System Design",
    difficulty: "Medium",
    title: "Design a Simple In-Memory Event Bus",
    description: "Implement a synchronous event bus that allows components to publish and subscribe to typed events. Subscribers register handlers for specific event types and are notified when an event is published. Support wildcard subscriptions for all events.",
    constraints: [
      "subscribe(Class<T> eventType, Consumer<T> handler) registers a handler",
      "publish(Object event) dispatches to all matching handlers",
      "Handlers are invoked synchronously in the order they were registered",
      "Support unsubscribe by returning a Subscription token from subscribe()",
    ],
    starterCode: `public class EventBus {
    private final Map<Class<?>,
        List<Consumer<Object>>> handlers =
            new ConcurrentHashMap<>();

    @SuppressWarnings("unchecked")
    public <T> Subscription subscribe(
            Class<T> eventType,
            Consumer<T> handler) {
        // TODO: Add handler to list for eventType
        // TODO: Return a Subscription that removes
        //       this handler on cancel()
        return null;
    }

    public void publish(Object event) {
        // TODO: Find handlers for event.getClass()
        // TODO: Also check for superclass handlers
        //       (for wildcard Object.class subscriptions)
        // TODO: Invoke each handler, catch exceptions
    }
}

@FunctionalInterface
public interface Subscription {
    void cancel();
}`,
    hints: [
      "handlers.computeIfAbsent(eventType, k -> new CopyOnWriteArrayList<>()).add((Consumer<Object>) handler)",
      "Return () -> handlers.get(eventType).remove(handler) as the Subscription lambda",
      "In publish: walk event.getClass() superclass hierarchy — check handlers for each superclass to support wildcard Object.class listeners",
      "Wrap each handler.accept(event) in try-catch to prevent one bad handler from stopping others",
    ],
  },

  // === AI/ML ===
  {
    id: "cp-ai-1",
    topic: "AI/ML Systems",
    difficulty: "Easy",
    title: "Implement a Simple Tokenizer",
    description: "Build a basic word-level tokenizer for text processing. Implement vocabulary building, encoding (text to token IDs), and decoding (token IDs to text). Include handling for unknown tokens.",
    constraints: [
      "Build vocabulary from a training corpus",
      "Encode text to integer token IDs",
      "Decode token IDs back to text",
      "Handle unknown tokens with a special <UNK> token",
    ],
    starterCode: `public class SimpleTokenizer {
    private Map<String, Integer> wordToId;
    private Map<Integer, String> idToWord;
    private static final String UNK = "<UNK>";

    public void buildVocabulary(List<String> corpus) {
        // TODO: Tokenize each sentence
        // TODO: Build word -> id mapping
        // TODO: Reserve id 0 for <UNK>
    }

    public List<Integer> encode(String text) {
        // TODO: Split text into words
        // TODO: Map each word to its ID
        // TODO: Use UNK id for unknown words
        return new ArrayList<>();
    }

    public String decode(List<Integer> tokenIds) {
        // TODO: Map IDs back to words
        // TODO: Join with spaces
        return "";
    }
}`,
    hints: [
      "Split on whitespace and punctuation, convert to lowercase for normalization",
      "Use LinkedHashMap to maintain insertion order of vocabulary",
      "Consider adding special tokens: <PAD> for padding, <BOS>/<EOS> for sequence boundaries",
      "This is a simplified version — real tokenizers use BPE (GPT) or WordPiece (BERT)",
    ],
  },
  {
    id: "cp-ai-2",
    topic: "AI/ML Systems",
    difficulty: "Medium",
    title: "Implement Cosine Similarity and Vector Search",
    description: "Implement cosine similarity between two vectors and a brute-force nearest-neighbor search over a corpus of document embeddings. This is the core of a simple semantic search engine.",
    constraints: [
      "cosineSimilarity(float[] a, float[] b) returns value in [-1, 1]",
      "search(float[] query, List<float[]> corpus, int k) returns top-k most similar indices",
      "Vectors are L2-normalized (unit vectors) for efficiency",
      "Handle edge cases: zero vectors, mismatched dimensions",
    ],
    starterCode: `public class VectorSearch {

    public float cosineSimilarity(
            float[] a, float[] b) {
        // TODO: dot product / (||a|| * ||b||)
        // For unit vectors: just the dot product
        return 0f;
    }

    public List<Integer> search(
            float[] query,
            List<float[]> corpus,
            int k) {
        // TODO: Score each document
        // TODO: Return indices of top-k scores
        return Collections.emptyList();
    }

    public float[] normalize(float[] vector) {
        // TODO: Divide each element by L2 norm
        return vector;
    }
}`,
    hints: [
      "Dot product: float sum = 0; for (int i=0; i<a.length; i++) sum += a[i]*b[i]; return sum",
      "For unit vectors (after normalize()), cosineSimilarity = dot product",
      "Use a PriorityQueue<int[]> of size k (min-heap by score) to find top-k in O(n log k)",
      "L2 norm: Math.sqrt(sum of squares); divide each element by it to normalize",
    ],
  },
  {
    id: "cp-ai-3",
    topic: "AI/ML Systems",
    difficulty: "Hard",
    title: "Implement Scaled Dot-Product Attention",
    description: "Implement the core self-attention mechanism from the Transformer architecture. Given Query, Key, and Value matrices, compute attention scores, apply softmax, and return the weighted sum of values. This is the building block of every modern LLM.",
    constraints: [
      "Input: float[][] Q, K, V — each shape [seqLen, dModel]",
      "Attention(Q,K,V) = softmax(Q * K^T / sqrt(dModel)) * V",
      "Implement matrix multiply, transpose, and row-wise softmax",
      "Output: float[][] of shape [seqLen, dModel]",
    ],
    starterCode: `public class ScaledDotProductAttention {

    public float[][] attend(float[][] Q, float[][] K,
            float[][] V) {
        int seqLen = Q.length;
        int dModel = Q[0].length;
        double scale = Math.sqrt(dModel);

        // Step 1: scores = Q * K^T  [seqLen x seqLen]
        float[][] scores = matMul(Q, transpose(K));

        // Step 2: Scale and apply softmax row-wise
        for (int i = 0; i < seqLen; i++) {
            for (int j = 0; j < seqLen; j++) {
                scores[i][j] /= scale;
            }
            // TODO: Apply softmax to scores[i]
        }

        // Step 3: Output = scores * V  [seqLen x dModel]
        return matMul(scores, V);
    }

    private void softmax(float[] row) {
        // TODO: Numerically stable softmax
        // Subtract max before exp to prevent overflow
    }

    private float[][] transpose(float[][] m) {
        // TODO: Return m^T
        return null;
    }

    private float[][] matMul(float[][] A, float[][] B) {
        // TODO: Standard matrix multiplication
        // A: [m x k], B: [k x n] -> result: [m x n]
        return null;
    }
}`,
    hints: [
      "softmax: float max = Arrays.stream(row).max().orElse(0); compute exp(x-max) for each element; divide by sum",
      "transpose: float[][] t = new float[m[0].length][m.length]; for i,j: t[j][i] = m[i][j]",
      "matMul: result[i][j] = sum over k of A[i][k] * B[k][j]",
      "This is attention over a full sequence; for causal/autoregressive models, mask scores[i][j] = -INF where j > i before softmax",
    ],
  },
  {
    id: "cp-ai-4",
    topic: "AI/ML Systems",
    difficulty: "Medium",
    title: "Implement a Sliding Window Feature Extractor",
    description: "Build a feature extraction pipeline for a time-series ML model. Given a stream of sensor readings, produce fixed-length feature vectors using a sliding window: compute mean, standard deviation, min, max, and rate of change for each window.",
    constraints: [
      "Window size W = 10 readings, slide by 1 each step",
      "Features per window: [mean, std, min, max, slope (linear regression slope)]",
      "Process the stream incrementally — do not recalculate from scratch each step",
      "Output: List<float[]> where each float[] has 5 features",
    ],
    starterCode: `public class SlidingWindowFeatureExtractor {
    private final int windowSize;
    private final Deque<Double> window = new ArrayDeque<>();
    private double sum = 0, sumOfSquares = 0;

    public SlidingWindowFeatureExtractor(int windowSize) {
        this.windowSize = windowSize;
    }

    public Optional<float[]> addReading(double value) {
        // TODO: Add value, maintain sum and sumOfSquares
        // TODO: If window exceeds size, remove oldest:
        //       update sum and sumOfSquares on removal
        // TODO: If window is full, return extractFeatures()
        return Optional.empty();
    }

    private float[] extractFeatures() {
        // TODO: Compute [mean, std, min, max, slope]
        // Mean and std can use running sum/sumOfSquares
        // Slope: use simple linear regression on the window
        return new float[5];
    }

    private float computeSlope() {
        // TODO: Least squares slope over [0..W-1] x values
        // slope = (n*Σxy - Σx*Σy) / (n*Σx² - (Σx)²)
        return 0f;
    }
}`,
    hints: [
      "On removal of oldest value 'old': sum -= old; sumOfSquares -= old*old",
      "mean = sum / windowSize; variance = (sumOfSquares / windowSize) - mean*mean; std = Math.sqrt(variance)",
      "For slope: x values are 0,1,...,W-1. Precompute Σx = W*(W-1)/2, Σx² = W*(W-1)*(2W-1)/6 as constants",
      "Σxy: iterate window with index i — double[] arr = window.toArray(); then sum i*arr[i]",
    ],
  },
  
  
];

export const followUps: FollowUp[] = [
  // === COLLECTIONS ===
  {
    id: "fu-col-1",
    topic: "Collections",
    scenario: "You're reviewing a colleague's code that uses HashMap in a multi-threaded web server.",
    initialQuestion: "The code stores user sessions in a HashMap shared across request threads. What problems do you foresee?",
    followUps: [
      {
        question: "They suggest wrapping the HashMap with Collections.synchronizedMap(). Is that sufficient?",
        expectation: "Explain that synchronizedMap provides safety for individual operations but not compound operations (check-then-act patterns). Iteration still needs external synchronization. ConcurrentHashMap is usually better.",
      },
      {
        question: "What if I use ConcurrentHashMap — can I safely iterate over it while other threads modify it?",
        expectation: "Yes, ConcurrentHashMap iterators are weakly consistent. They won't throw ConcurrentModificationException but may not reflect the latest modifications. Explain the trade-off between consistency and performance.",
      },
      {
        question: "How would you handle session expiration? The map could grow indefinitely.",
        expectation: "Use a scheduled cleanup task, or a cache library like Caffeine/Guava with expireAfterAccess. Discuss WeakHashMap limitations (keys are weak, not values). Consider a TTL-based eviction strategy.",
      },
    ],
  },
  {
    id: "fu-col-2",
    topic: "Collections",
    scenario: "You're optimizing a search service that performs millions of contains() checks per second.",
    initialQuestion: "You have a list of 100K banned words. How would you efficiently check if a given word is banned?",
    followUps: [
      {
        question: "Your HashSet approach works, but now the banned list is 10 million entries and memory is a concern. What alternatives exist?",
        expectation: "Discuss Bloom filters (probabilistic, space-efficient, allows false positives but no false negatives), Trie structures for prefix matching, or BitSet for integer-indexed elements.",
      },
      {
        question: "If we need to persist this list and reload it on startup, what data structure would you serialize?",
        expectation: "Discuss trade-offs: serialize the HashSet directly (fast deserialization but large), use a sorted array with binary search (compact, immutable), or a memory-mapped file with a perfect hash function for the fastest lookups.",
      },
    ],
  },

  // === JVM ===
  {
    id: "fu-jvm-1",
    topic: "JVM",
    scenario: "Your production application is experiencing GC pauses of 3-5 seconds, causing timeouts in downstream services.",
    initialQuestion: "How would you diagnose and fix these GC pauses?",
    followUps: [
      {
        question: "The GC logs show frequent Full GC collections and the old generation is filling up. What could be causing this?",
        expectation: "Discuss possible causes: memory leaks (objects referenced unintentionally), large long-lived caches without eviction, insufficient heap size, promotion of short-lived objects due to undersized young generation. Suggest heap dump analysis with Eclipse MAT or VisualVM.",
      },
      {
        question: "After fixing the leak, you still see 200ms pauses. The team is debating between tuning G1GC and switching to ZGC. What's your recommendation?",
        expectation: "For 200ms pauses, first tune G1GC: reduce -XX:MaxGCPauseMillis, ensure adequate heap headroom, tune region size. If latency requirements are sub-10ms, ZGC is the better choice — near-zero pauses regardless of heap size, but slightly lower throughput. Discuss the trade-off and mention that ZGC works best with Java 17+.",
      },
      {
        question: "How would you set up monitoring to catch GC issues before they affect users?",
        expectation: "Enable GC logging (-Xlog:gc*), monitor via JMX/Prometheus (GC pause duration, frequency, heap occupancy). Set alerts on: p99 GC pause > threshold, heap usage > 80%, Full GC frequency. Tools: Grafana dashboards, JFR (Java Flight Recorder) for detailed analysis.",
      },
    ],
  },

  // === CONCURRENCY ===
  {
    id: "fu-con-1",
    topic: "Concurrency",
    scenario: "You're building a high-throughput order processing system that needs to handle 50K orders/second.",
    initialQuestion: "How would you design the thread pool configuration for this system?",
    followUps: [
      {
        question: "You initially set the thread pool to 200 threads, but performance degraded. What happened?",
        expectation: "Too many threads cause excessive context switching, memory overhead (each thread ~1MB stack), and contention on shared resources. For CPU-bound work: threads = cores + 1. For I/O-bound: threads = cores * (1 + wait_time/service_time). Discuss Little's Law and benchmarking to find the sweet spot.",
      },
      {
        question: "Some orders involve external API calls that occasionally take 30 seconds. How do you prevent them from starving other orders?",
        expectation: "Use separate thread pools (bulkhead pattern) — one for fast local processing, one for slow external calls. Set timeouts on external calls. Use CompletableFuture for async composition. Consider a reactive approach (WebFlux) for I/O-bound work. Discuss backpressure mechanisms.",
      },
      {
        question: "How would you handle the case where the order queue grows faster than you can process?",
        expectation: "Implement backpressure: bounded queues with rejection policies (CallerRunsPolicy, DiscardOldestPolicy), rate limiting at the API gateway, message broker (Kafka) as a buffer with consumer lag monitoring. Discuss graceful degradation — return 503 Service Unavailable with Retry-After header rather than accepting orders you can't process.",
      },
    ],
  },

  // === SPRING BOOT ===
  {
    id: "fu-sb-1",
    topic: "Spring Boot",
    scenario: "You're leading a team building a Spring Boot microservice for a payment processing system.",
    initialQuestion: "How would you structure the Spring Boot application? Explain your package structure and layering.",
    followUps: [
      {
        question: "A junior developer is using @Autowired field injection everywhere and putting business logic in controllers. How would you mentor them?",
        expectation: "Explain why constructor injection is preferred (immutability, testability, explicit dependencies). Controllers should only handle HTTP concerns (validation, request/response mapping); business logic belongs in service layer. Show the benefits: easier unit testing (inject mocks), clear dependency graph, separation of concerns.",
      },
      {
        question: "The team wants to add caching. @Cacheable works locally but fails with multiple instances. What's your approach?",
        expectation: "Local caching (@Cacheable with ConcurrentMapCacheManager) doesn't share state across instances. Use Redis as a distributed cache with spring-boot-starter-data-redis. Configure RedisCacheManager with TTL. Discuss cache-aside pattern, cache invalidation strategies (TTL, event-driven), and potential issues (stale reads, thundering herd on cache miss).",
      },
      {
        question: "After deploying to production, you discover that @Transactional isn't working on some methods. How would you debug this?",
        expectation: "Check for self-invocation (calling @Transactional method from within the same class bypasses the proxy). Verify the method is public (non-public methods are silently ignored). Check for incorrect exception handling (checked exceptions don't trigger rollback by default). Enable spring.jpa.show-sql and transaction debug logging. Consider using TransactionTemplate for programmatic control.",
      },
    ],
  },

  // === MICROSERVICES ===
  {
    id: "fu-ms-1",
    topic: "Microservices",
    scenario: "Your e-commerce platform is migrating from a monolith to microservices. The team is deciding how to split the Order, Inventory, and Payment services.",
    initialQuestion: "How would you approach the decomposition? What are the boundaries?",
    followUps: [
      {
        question: "The team wants to use synchronous REST calls between Order, Inventory, and Payment. What problems might arise?",
        expectation: "Discuss cascading failures (if Payment is down, Order can't complete), increased latency (chain of calls), tight coupling. Suggest async communication via events/messages (Kafka) for eventual consistency, with the Saga pattern for distributed transactions. Keep synchronous calls for queries, async for commands.",
      },
      {
        question: "A customer places an order: we need to reserve inventory, process payment, and confirm the order. How would you implement this with the Saga pattern?",
        expectation: "Orchestration Saga: Order Service acts as orchestrator — (1) Create order (PENDING), (2) Reserve inventory, (3) Process payment, (4) Confirm order. If payment fails after inventory reservation, the compensating transaction releases the reserved inventory. Each step is idempotent. Use a saga state machine. Discuss the alternative choreography approach and why orchestration is clearer for this flow.",
      },
      {
        question: "Six months in, the team is overwhelmed managing 15 microservices. What went wrong?",
        expectation: "Likely premature decomposition — not enough operational maturity (logging, tracing, CI/CD, monitoring) before splitting. Discuss: start with a well-modularized monolith, extract services only when there's a clear scaling or team boundary need. Each service needs its own deployment pipeline, monitoring, and on-call rotation. Consider consolidating related services back into fewer, coarser-grained services.",
      },
    ],
  },

  // === DATABASE DESIGN ===
  {
    id: "fu-db-1",
    topic: "Database Design",
    scenario: "Your team is designing the database for a social media platform with 50 million users.",
    initialQuestion: "How would you design the schema for the user feed (posts from people they follow)?",
    followUps: [
      {
        question: "A fan-out-on-write approach pre-computes each user's feed. How would you handle a celebrity with 10 million followers?",
        expectation: "Fan-out-on-write is expensive for celebrities (writing to 10M feeds per post). Use a hybrid approach: fan-out-on-write for normal users, fan-out-on-read for celebrities (fetch their posts on demand and merge). Twitter uses this hybrid model. Discuss the trade-off between write amplification and read latency.",
      },
      {
        question: "Queries are slow because the posts table has 500 million rows. How do you scale?",
        expectation: "Horizontal sharding by user_id (hash or range-based). Each shard handles a subset of users. Discuss: consistent hashing for minimal reshuffling when adding nodes, read replicas for heavy read workloads, separate hot data (recent posts) from cold data (archived posts) via time-based partitioning. Consider moving to Cassandra for write-heavy feed storage.",
      },
      {
        question: "The product team wants to add full-text search on posts. Can you just add a LIKE query?",
        expectation: "LIKE '%keyword%' can't use indexes and scans the entire table — terrible for 500M rows. Use a dedicated search engine: Elasticsearch or Apache Solr. Index post content, user names, hashtags. Use an async pipeline (CDC or event-driven) to keep the search index in sync with the primary database. Discuss trade-offs: eventual consistency of the search index, managing two data stores.",
      },
    ],
  },

  // === SYSTEM DESIGN ===
  {
    id: "fu-sd-1",
    topic: "System Design",
    scenario: "You're designing a URL shortener (like TinyURL) expected to handle 100M URLs and 10B redirects per month.",
    initialQuestion: "Walk me through your high-level design, starting with the API and data model.",
    followUps: [
      {
        question: "How do you generate unique short codes? What about collisions?",
        expectation: "Option 1: Auto-increment counter + Base62 encoding (guaranteed unique, sequential, but predictable). Option 2: Random 6-char Base62 generation with collision checking (retry on collision — probability is low with 62^6 = 56B possible codes). Option 3: MD5/SHA256 of the URL, take first 6 chars (deterministic, same URL always maps the same). Discuss pre-generation of IDs vs on-demand. For distributed systems, use Snowflake-style IDs or a Zookeeper-based counter.",
      },
      {
        question: "Your service is deployed across 3 data centers. How do you handle ID uniqueness across regions?",
        expectation: "Range-based partitioning: assign each data center a non-overlapping ID range (DC1: 1-1B, DC2: 1B-2B, DC3: 2B-3B). Or use Twitter Snowflake: 41 bits timestamp + 5 bits datacenter + 5 bits machine + 12 bits sequence = 64-bit unique ID. Discuss trade-offs: range partitioning is simple but wastes ranges; Snowflake is more flexible but requires clock synchronization.",
      },
      {
        question: "You chose 301 redirects for performance, but now the product team wants analytics (click count, referrer, location). How do you adapt?",
        expectation: "Switch to 302 (temporary redirect) so browsers hit the service every time, enabling click tracking. Log each redirect to an analytics pipeline (Kafka -> Spark/Flink -> data warehouse). If you need 301's performance with analytics, use a JavaScript redirect page that fires a tracking pixel/beacon before redirecting. Discuss the tension between performance (301 caching) and observability (302 per-request tracking).",
      },
    ],
  },

  // === AI/ML SYSTEMS ===
  {
    id: "fu-ai-1",
    topic: "AI/ML Systems",
    scenario: "Your company wants to add an ML-powered search feature to its Java backend product catalog.",
    initialQuestion: "How would you integrate a machine learning model into your existing Java/Spring Boot backend?",
    followUps: [
      {
        question: "The ML team trained a model in Python/PyTorch. How do you serve it from Java?",
        expectation: "Options: (1) Deploy the model as a separate Python microservice (Flask/FastAPI) and call it via REST/gRPC from Java — cleanest separation. (2) Use ONNX Runtime for Java to run the exported model natively. (3) Use TorchServe for production-grade model serving with batching. Discuss latency trade-offs: network hop for microservice vs native inference with ONNX. Recommend option 1 for flexibility, option 2 for lowest latency.",
      },
      {
        question: "The model's latency is 200ms, but our API SLA is 100ms. How do you handle this?",
        expectation: "Pre-compute embeddings offline and store in a vector database (Pinecone, Milvus, pgvector). At query time, compute the query embedding (fast) and do nearest-neighbor search against pre-computed vectors (fast). Use caching (Redis) for popular queries. Consider model quantization (FP32 -> INT8) to reduce inference time. Use async processing: return initial results immediately, enhance with ML results via streaming/WebSocket.",
      },
      {
        question: "How would you monitor the model in production to detect when it starts performing poorly?",
        expectation: "Monitor: (1) Data drift — compare input distribution against training data using statistical tests (KS test, PSI). (2) Model performance — track precision/recall on labeled samples, click-through rates as proxy. (3) Latency and error rates. Set up automated alerts and a retraining pipeline. Discuss shadow mode (run new model alongside old, compare results before switching) and A/B testing for gradual rollouts.",
      },
    ],
  },
  {
    id: "fu-col-3",
    topic: "Collections",
    scenario: "You're building a leaderboard for a gaming platform that must rank 1 million players by score in real time.",
    initialQuestion: "What data structure would you use for the in-memory leaderboard? How do you handle frequent score updates?",
    followUps: [
      {
        question: "A TreeMap<Integer, Set<String>> keyed by score works, but lookup by player name is O(n). How do you fix that?",
        expectation: "Maintain a second HashMap<String, Integer> to map playerId -> currentScore. On score update: remove the player from the old score's set in TreeMap, update the HashMap, insert into the new score's set. Both operations are O(log n). This is the classic dual-structure pattern.",
      },
      {
        question: "The leaderboard needs to support 'rank of a player' (e.g., rank 42,503). TreeMap gives you O(log n) getScore but not rank. How?",
        expectation: "Discuss an Order Statistic Tree (augmented BST that stores subtree sizes). Java doesn't have one built-in — use a Fenwick Tree (Binary Indexed Tree) over a compressed score range or Redis ZADD (sorted set backed by skip list which supports ZRANK in O(log n)). Redis is the production answer.",
      },
      {
        question: "The leaderboard now needs top 100 players globally across 10 data centers. How do you aggregate?",
        expectation: "Each data center maintains its own sorted set. A global aggregation service periodically (or on-demand) fetches top 1000 from each DC, merges using a k-way merge (PriorityQueue of size 10 to merge 10 lists), and materializes the global top 100. Push to a CDN cache with a short TTL for fast reads.",
      },
    ],
  },

  // === JVM ===
  {
    id: "fu-jvm-2",
    topic: "JVM",
    scenario: "Your microservice suddenly starts throwing OutOfMemoryError: Metaspace after running for several hours.",
    initialQuestion: "How would you diagnose the cause of this Metaspace OOM?",
    followUps: [
      {
        question: "The Metaspace grows because your application dynamically generates classes at runtime. What could be causing this?",
        expectation: "Discuss: dynamic proxies (Spring AOP, JDK proxies), code generation frameworks (Byte Buddy, ASM, cglib), expression language parsers (SpEL, OGNL), Groovy/scripting engines, or hot-reload mechanisms creating new classloaders on each redeploy without unloading old ones. Check with -XX:+PrintClassHistogram or Java Flight Recorder class loading events.",
      },
      {
        question: "You find that a custom ClassLoader is created on every request but never garbage collected. What prevents ClassLoader GC?",
        expectation: "A ClassLoader can only be GCed when all classes it loaded are unreachable AND no living objects are instances of those classes AND no references to the ClassLoader exist. Common leaks: static fields in loaded classes holding references, ThreadLocal entries not removed, JDK internals (like JDBC drivers registered in DriverManager). Use heap dump analysis to find GC root paths to the leaked ClassLoader.",
      },
      {
        question: "After fixing the leak, what JVM flags would you add to proactively manage Metaspace?",
        expectation: "Set -XX:MetaspaceSize=256m (initial) and -XX:MaxMetaspaceSize=512m to cap Metaspace and trigger GC sooner. Enable -XX:+CMSClassUnloadingEnabled (for CMS) or it's on by default for G1/ZGC. Monitor via JMX (MemoryPool 'Metaspace' usage). Alert when Metaspace utilization exceeds 80% of max.",
      },
    ],
  },

  // === CONCURRENCY ===
  {
    id: "fu-con-2",
    topic: "Concurrency",
    scenario: "You're implementing a shared cache for a CPU-intensive computation in a multi-threaded web server.",
    initialQuestion: "You use a HashMap with a check-then-put pattern: if (!cache.containsKey(k)) cache.put(k, compute(k)). What is wrong?",
    followUps: [
      {
        question: "You switch to ConcurrentHashMap but still use the same check-then-put pattern. Is it now correct?",
        expectation: "No. Even with ConcurrentHashMap, containsKey() + put() is a non-atomic compound operation — two threads can both pass the containsKey() check and both call compute(). Use ConcurrentHashMap.computeIfAbsent(key, k -> compute(k)) which atomically checks and computes. computeIfAbsent holds a lock on the bucket during computation.",
      },
      {
        question: "compute() is very slow (5 seconds). With computeIfAbsent, all threads requesting the same key block for 5 seconds. How do you fix this?",
        expectation: "Use a futures-based pattern: ConcurrentHashMap<K, CompletableFuture<V>>. computeIfAbsent stores a CompletableFuture immediately (fast, unblocks the lock). All threads waiting for the same key share the same Future and block on .get() instead of the map lock. The first thread triggers the actual computation. This is the memoizer pattern from Java Concurrency in Practice.",
      },
      {
        question: "The cache grows unboundedly. How would you add TTL-based eviction?",
        expectation: "Use Caffeine cache (successor to Guava Cache) with expireAfterWrite or expireAfterAccess. If rolling your own: wrap values with an expiry timestamp and check on access (lazy eviction), plus a ScheduledExecutorService for eager cleanup. Caffeine uses a wheel timer internally for efficient O(1) eviction scheduling. Discuss maximum size with LRU/LFU eviction as an alternative to TTL.",
      },
    ],
  },

  // === SPRING BOOT ===
  {
    id: "fu-sb-2",
    topic: "Spring Boot",
    scenario: "Your Spring Boot service is slow to start — it takes 45 seconds to boot in production, blocking deployments.",
    initialQuestion: "How would you diagnose and reduce the startup time?",
    followUps: [
      {
        question: "You enable spring.jpa.defer-datasource-initialization=true and lazy initialization. The service now starts in 15 seconds but fails on the first request. Why?",
        expectation: "Lazy initialization defers bean creation until first use — the first request triggers all remaining initialization, causing a slow first request and potentially cascading timeouts. Fix: use spring.main.lazy-initialization=true for development only, or selectively mark non-critical beans as @Lazy. Ensure health checks wait for the application to be fully ready (Kubernetes readiness probe should check /actuator/health/readiness).",
      },
      {
        question: "You profile startup and find Hibernate takes 20 seconds to validate the schema. How do you fix this in production?",
        expectation: "Set spring.jpa.hibernate.ddl-auto=validate only in dev; use none or validate with a separate Flyway/Liquibase migration in production. For large schemas, schema validation via Hibernate can be slow — consider disabling it and relying on Flyway's checksum validation instead. Alternatively, use spring.jpa.properties.hibernate.temp.use_jdbc_metadata_defaults=false to skip some metadata queries.",
      },
      {
        question: "The team suggests moving to GraalVM native image to get sub-second startup. What are the trade-offs?",
        expectation: "GraalVM native image compiles Java ahead-of-time to a native binary — startup in 50-200ms with low memory footprint. Trade-offs: (1) Build time is long (minutes). (2) Reflection, dynamic proxies, and classpath scanning must be explicitly configured via hints (Spring 3 provides @RegisterReflectionForBinding etc.). (3) Peak throughput is lower than JIT-compiled JVM (no profile-guided optimization). (4) Debugging is harder. Best for serverless/short-lived workloads; not ideal for long-running services where JIT pays off.",
      },
    ],
  },

  // === MICROSERVICES ===
  {
    id: "fu-ms-2",
    topic: "Microservices",
    scenario: "You are responsible for a payment microservice that occasionally processes a charge twice, causing duplicate billing.",
    initialQuestion: "How would you identify the root cause of duplicate charges?",
    followUps: [
      {
        question: "You discover that retries in the HTTP client (due to network timeouts) cause the payment to be sent twice. How do you prevent duplicates at the API level?",
        expectation: "Implement idempotency keys: the client generates a unique idempotency_key per payment attempt and sends it as a header. The server stores (idempotency_key -> result) in Redis or the database. On receiving a request, check if the key exists — if yes, return the cached result without reprocessing. Key expires after 24 hours. This is how Stripe implements idempotency.",
      },
      {
        question: "The payment provider (Stripe) also sends webhook events for payment success. You process both the API response and the webhook, charging twice. How do you fix this?",
        expectation: "Deduplicate by event ID: store processed webhook event IDs in a set (Redis SET or DB unique constraint). Before processing, check if the event ID has been seen. If yes, return 200 (acknowledge to stop retries) without processing. This is the standard webhook idempotency pattern. Also, use database-level unique constraints on (order_id, payment_status = 'CAPTURED') as a safety net.",
      },
      {
        question: "How would you test your payment service for idempotency, timeout, and retry scenarios in CI?",
        expectation: "Use WireMock to simulate the payment provider with configurable delays and fault injection (network timeouts, 500 errors). Write tests that call the service multiple times with the same idempotency key and assert only one charge occurs. Use Testcontainers for Redis (idempotency key store) and Postgres. Inject chaos via @TestPropertySource to lower retry limits. Contract testing (Pact) to verify the idempotency key contract between client and server.",
      },
    ],
  },

  // === DATABASE DESIGN ===
  {
    id: "fu-db-2",
    topic: "Database Design",
    scenario: "Your team is running PostgreSQL with a single 2TB database that is experiencing slow queries and high CPU during peak traffic.",
    initialQuestion: "How would you approach diagnosing and improving the database performance?",
    followUps: [
      {
        question: "EXPLAIN ANALYZE shows a sequential scan on a 500M row orders table despite an index on (user_id, created_at). Why might the index not be used?",
        expectation: "Possible causes: (1) The query retrieves too many rows — if >10-15% of the table, the planner prefers a seq scan over random I/O. (2) Stale table statistics — run ANALYZE orders to refresh. (3) Index column type mismatch (casting user_id from VARCHAR to INT). (4) Function wrapping the column in WHERE clause (WHERE LOWER(email) = ...) prevents index usage — use a functional index. Check with SET enable_seqscan = off to force index use and compare costs.",
      },
      {
        question: "After adding indexes, writes are slower than before. What is the trade-off and how do you manage it?",
        expectation: "Every index adds write overhead: each INSERT/UPDATE/DELETE must update all indexes on the table. For a write-heavy table, too many indexes hurt throughput. Audit index usage with pg_stat_user_indexes — drop unused indexes (idx_scan = 0). Consider partial indexes (WHERE status = 'PENDING') for rarely queried subsets. For bulk loads, drop non-critical indexes before loading and rebuild after. Covering indexes (INCLUDE clause) can reduce index count by serving multiple query patterns.",
      },
      {
        question: "The team proposes migrating to a read replica for reporting queries. How do you ensure the application doesn't read stale data for transactional operations?",
        expectation: "Route OLTP reads (requiring fresh data) to the primary. Route reporting/analytics queries (tolerant of slight lag) to the replica. In Spring, use @Transactional(readOnly=true) with a routing DataSource (AbstractRoutingDataSource) that switches to the replica for read-only transactions. Monitor replication lag — if lag exceeds a threshold (e.g., 5 seconds), fall back to the primary. For critical paths (post-write reads), use synchronous replication or read from primary for the first N seconds after a write.",
      },
    ],
  },

  // === SYSTEM DESIGN ===
  {
    id: "fu-sd-2",
    topic: "System Design",
    scenario: "You are designing a chat application (like WhatsApp) that needs to deliver messages in real time to millions of concurrent users.",
    initialQuestion: "What protocol and connection model would you use to deliver messages with low latency?",
    followUps: [
      {
        question: "You chose WebSockets. How do you route a message from User A to User B when they're connected to different servers?",
        expectation: "Maintain a mapping of userId -> serverId/connectionId in Redis. When User A sends a message: the receiving server checks Redis to find which server User B is connected to, then publishes the message to a Redis Pub/Sub channel (or sends to a Kafka topic) that the target server subscribes to. The target server delivers over User B's WebSocket connection. This pub/sub fan-out is the core of horizontal WebSocket scaling.",
      },
      {
        question: "User B is offline. How do you deliver the message when they come back online?",
        expectation: "Persist the message to a database (Cassandra or DynamoDB partitioned by conversation_id). Store a 'last_delivered_message_id' per user. On reconnection, the client sends its last seen message ID; the server queries for messages newer than that ID and flushes them. Implement push notifications (APNs/FCM) to wake up the mobile app. Use message acknowledgements (client sends ACK after receiving) to track delivery status.",
      },
      {
        question: "How do you guarantee message ordering within a conversation?",
        expectation: "Assign a monotonically increasing sequence number per conversation (Lamport clock or a database sequence). Clients display messages sorted by sequence number. If a message arrives out of order, buffer it until the gap is filled (with a short timeout). Using a Kafka topic per conversation (or partitioned by conversation_id) ensures ordering within a partition. For group messages, a total ordering algorithm (Paxos/Raft-based sequence assignment) ensures all participants see the same order.",
      },
    ],
  },

  // === AI/ML SYSTEMS ===
  {
    id: "fu-ai-2",
    topic: "AI/ML Systems",
    scenario: "Your team is building a fraud detection system for a fintech app that must classify transactions as fraudulent or legitimate in real time (<100ms).",
    initialQuestion: "What approach would you take for the ML model? What features would you engineer?",
    followUps: [
      {
        question: "The dataset is highly imbalanced: 99.9% legitimate, 0.1% fraudulent. Training a model on this dataset gives 99.9% accuracy but catches no fraud. How do you handle this?",
        expectation: "Accuracy is a misleading metric here. Use precision-recall AUC or F1 score. Techniques: (1) Oversampling the minority class with SMOTE (Synthetic Minority Over-sampling). (2) Undersampling the majority class. (3) Class weights in the loss function (class_weight='balanced' in sklearn). (4) Anomaly detection framing (train only on legitimate transactions, flag outliers). (5) Threshold tuning — lower the classification threshold to increase recall at the cost of precision, then manually tune based on business cost of false negatives vs false positives.",
      },
      {
        question: "Your gradient boosting model has 98% precision/recall on the test set but degrades to 85% in production after 2 months. What happened?",
        expectation: "This is concept drift — the statistical relationship between features and the fraud label has changed because fraudsters adapt their behavior. Solutions: (1) Data drift monitoring — compare feature distributions between training and inference data using PSI (Population Stability Index) or KS tests. (2) Model retraining pipeline — retrain weekly/monthly on recent data. (3) Online learning or continual learning for faster adaptation. (4) Champion-challenger deployment — always A/B test a newly trained model against the current one before full rollout.",
      },
      {
        question: "Your model has excellent recall but your customer support team is flooded with false positive disputes. How do you balance this in production?",
        expectation: "Frame as a cost-sensitive optimization: define the cost of a false negative (missed fraud, financial loss) vs false positive (customer friction, support cost, potential churn). Adjust the classification threshold to minimize total cost. Use a tiered response: high-confidence fraud -> auto-block, medium confidence -> step-up authentication (OTP/2FA), low confidence -> allow with monitoring. Collect feedback from resolved disputes to label false positives and feed back into retraining. Present explainability (SHAP values) to help support agents quickly validate flags.",
      },
    ],
  },
];

export const allTopics = [
  "Collections",
  "JVM",
  "Concurrency",
  "Spring Boot",
  "Microservices",
  "Database Design",
  "System Design",
  "AI/ML Systems",
] as const;

export const difficultyColors: Record<string, string> = {
  Easy: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40",
  Medium: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40",
  Hard: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40",
};
