# Advanced Software Design: Building Scalable AI Integrations with the Model Context Protocol
## Uppsala University Master Class - 45-60 minutes
## Speaker: Joel [Your Last Name], Innovation Leader AI, Riksbanken

---

# OPENING (2 min)

## SLIDE 1: Title & Personal Introduction

**Visual**: Clean title with Uppsala University branding, your photo/bio

**Script:**
"Good morning! I'm Joel, and I lead AI innovation at Riksbanken, Sweden's central bank. My journey in software has taken me from building traditional enterprise systems to now architecting AI-powered solutions that handle some of Sweden's most critical financial operations.

Today, I want to share something that fundamentally changed how we think about AI system design. We'll explore the Model Context Protocol - not just as a technology, but as a case study in how good software design principles solve real architectural challenges.

By the end of this session, you'll understand how the same design patterns you've studied - separation of concerns, loose coupling, standardized interfaces - apply to cutting-edge AI systems. And hopefully, you'll leave with ideas for your own projects."

---

# PART 1: THE ARCHITECTURAL CHALLENGE (10 min)

## SLIDE 2: A Real Problem from Riksbanken

**Visual**: Architecture diagram of a failed integration attempt - show the mess

**Script:**
"Let me start with a failure. Last year at Riksbanken, we tried to build an AI assistant that could answer questions about Swedish monetary policy. Sounds simple, right?

We needed to connect to:
- Historical policy documents (PDF archives)
- Real-time market data (Bloomberg feeds)
- Internal analysis tools (proprietary models)
- Regulatory databases (ECB, BIS systems)

Our first architecture? [Show diagram] Custom integrations for each data source, hardcoded for GPT-4. Three months of work.

Then Claude 3 came out with better reasoning. We wanted to switch. The migration estimate? Another two months. 

This is a software design failure. We violated fundamental principles:
- **Tight coupling** - Our code was married to specific LLM APIs
- **No abstraction** - Direct dependencies everywhere
- **No separation of concerns** - Business logic mixed with integration code

Sound familiar? It should. These are the same mistakes we make in any poorly designed system."

## SLIDE 3: LLMs as a Software Component

**Visual**: Clean component diagram showing LLM as a service with inputs/outputs

**Script:**
"Let's properly frame the problem. An LLM is just another software component - a specialized one, but still a component.

**Inputs**: Text (prompts, context, instructions)
**Processing**: Statistical pattern matching on massive scale
**Outputs**: Text (predictions, completions, structured data)

From a software design perspective, it's a stateless service. Like any service, it has:
- **Capabilities**: What it can do (reasoning, generation)
- **Limitations**: What it can't do (execute code, access data, maintain state)
- **Interface requirements**: How we communicate with it

The key insight? LLMs are powerful reasoning engines trapped in isolation. They can't:
- Read your files
- Query your database  
- Call your APIs
- Remember previous conversations

This is by design - it's actually good architecture. The LLM does one thing well: reasoning. But we need to compose it with other components."

## SLIDE 4: The Integration Anti-Patterns

**Visual**: Three "anti-pattern" examples with red X marks

**Script:**
"Before we see the solution, let's examine common anti-patterns - approaches that seem reasonable but violate software design principles:

**Anti-pattern 1: The God Prompt**
```python
prompt = f'''Here's my entire database: {dump_database()}
Here's all my files: {read_all_files()}
Here's the user question: {question}'''
```
Violates: Single Responsibility, Resource efficiency, Scalability

**Anti-pattern 2: The Hardcoded Pipeline**
```python
if 'weather' in question:
    data = call_weather_api()
elif 'database' in question:
    data = query_postgresql()
# 50 more if-statements...
```
Violates: Open-Closed Principle, Extensibility

**Anti-pattern 3: The LLM-Specific Integration**
```python
class OpenAIWeatherTool:
    def format_for_gpt4(self, data):
        # GPT-4 specific formatting
class ClaudeWeatherTool:
    def format_for_claude(self, data):
        # Claude specific formatting
```
Violates: Don't Repeat Yourself, Interface Segregation

These aren't just bad AI practices - they're bad software design. Period."

## SLIDE 5: Design Requirements for AI Systems

**Visual**: Requirements matrix showing functional and non-functional requirements

**Script:**
"So what do we actually need? Let's define requirements like proper software engineers:

**Functional Requirements:**
- LLMs must access external data sources
- LLMs must execute actions (write files, update databases)
- Support multiple LLM providers
- Handle stateful operations (transactions, sessions)

**Non-Functional Requirements:**
- **Security**: Controlled access, authentication, audit trails
- **Scalability**: Handle thousands of requests per second
- **Maintainability**: Add new tools without changing core code
- **Interoperability**: Work across different platforms and languages

**Design Constraints:**
- LLMs are stateless - can't modify their internals
- Context windows are limited - can't load infinite data
- Response time matters - users expect real-time interaction

These requirements scream for a protocol-based solution. Not a framework, not a library - a protocol."

---

# PART 2: SOFTWARE DESIGN PRINCIPLES IN ACTION (15 min)

## SLIDE 6: Enter the Model Context Protocol

**Visual**: Clean MCP architecture diagram with protocol at the center

**Script:**
"The Model Context Protocol, or MCP, is Anthropic's answer to this design challenge. But here's what's brilliant - it's not AI-specific innovation. It's classical software architecture applied correctly.

MCP is essentially the application of three fundamental design principles:
1. **Protocol-oriented design** - Like HTTP for web, SMTP for email
2. **Service-oriented architecture** - Loosely coupled services
3. **Capability-based security** - Explicit permissions and boundaries

Think of it as USB-C for AI. Before USB-C, every device had proprietary connectors. After USB-C? One standard, infinite possibilities. MCP does this for AI integrations."

## SLIDE 7: The Protocol Layer - Separation of Concerns

**Visual**: Layered architecture showing clean separation

**Script:**
"Good software design starts with separation of concerns. MCP enforces this beautifully:

**Layer 1: Application Layer** (Your code)
- Business logic
- User interface
- Workflow orchestration

**Layer 2: MCP Client Layer** (Protocol implementation)
- Connection management
- Message serialization
- Protocol state machine

**Layer 3: Transport Layer** (stdio, SSE, WebSocket)
- Byte transmission
- Connection lifecycle
- Error handling

**Layer 4: MCP Server Layer** (Tool providers)
- Resource exposure
- Tool execution
- Security enforcement

Each layer has one job. Change your database? Only the server layer changes. Switch LLMs? Only the client configuration changes. This is textbook separation of concerns."

## SLIDE 8: The Three Primitives - Domain Modeling

**Visual**: UML-style diagram of Resources, Tools, and Prompts

**Script:**
"MCP models the AI integration domain with just three primitives. This is elegant design - minimal yet complete:

```typescript
interface Resource {
  uri: string;           // Identity
  name: string;          // Human-readable
  mimeType: string;      // Content type
  getText(): string;     // Accessor
}

interface Tool {
  name: string;          // Identity
  description: string;   // For LLM reasoning
  inputSchema: JSONSchema; // Contract
  execute(params: any): Promise<any>; // Action
}

interface Prompt {
  name: string;          // Identity
  template: string;      // Structure
  arguments: Schema[];   // Parameters
}
```

Notice how each primitive has:
- **Identity** - Unique identification
- **Contract** - Clear interface specification  
- **Single responsibility** - One clear purpose

This is domain-driven design at its finest. We've identified the core concepts and modeled them explicitly."

## SLIDE 9: Protocol Design - Message Passing

**Visual**: Sequence diagram showing JSON-RPC message flow

**Script:**
"MCP uses JSON-RPC 2.0 for message passing. Why? It's a proven pattern:

```json
// Request
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "sql_query",
    "arguments": {"query": "SELECT * FROM users"}
  }
}

// Response  
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "data": [{"id": 1, "name": "Alice"}]
  }
}
```

This gives us:
- **Request-response correlation** (via ID)
- **Error handling** (error field)
- **Extensibility** (additional fields ignored)
- **Language agnostic** (just JSON)

Compare this to REST where you'd need to design URL structures, HTTP verbs, status codes. JSON-RPC gives us everything in a simple, proven pattern."

## SLIDE 10: Real Implementation - Database Server

**Visual**: Code example with architecture annotations

**Script:**
"Let's see MCP's design principles in real code. Here's a database server I built for Riksbanken:

```python
from mcp.server import Server, Resource, Tool
from typing import Optional
import asyncpg

class DatabaseServer(Server):
    def __init__(self, connection_pool):
        self.pool = connection_pool  # Dependency injection
        
    @expose_resource("schema://{table}")
    async def get_schema(self, table: str) -> Resource:
        # Single Responsibility: Only schema information
        async with self.pool.acquire() as conn:
            schema = await conn.fetch(
                "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1",
                table
            )
        return Resource(
            uri=f"schema://{table}",
            mimeType="application/json",
            text=json.dumps(schema)
        )
    
    @expose_tool("query", auth_required=True)
    async def execute_query(
        self, 
        query: str, 
        readonly: bool = True
    ) -> dict:
        # Security by default
        if readonly and not query.strip().upper().startswith('SELECT'):
            raise PermissionError("Only SELECT queries allowed in readonly mode")
            
        # Input validation
        sanitized = self.sanitize_query(query)
        
        # Execution with resource limits
        async with self.pool.acquire() as conn:
            async with conn.transaction():
                results = await conn.fetch(sanitized, timeout=30)
                
        return {"rows": results, "count": len(results)}
```

Design principles applied:
- **Dependency Injection** - Pool passed in, not created
- **Single Responsibility** - Each method does one thing
- **Security by Default** - Readonly unless specified
- **Resource Management** - Proper connection handling
- **Error Boundaries** - Transactions for safety"

## SLIDE 11: Composition Pattern - Building Complex Systems

**Visual**: Component diagram showing multiple MCP servers composed

**Script:**
"Here's where it gets powerful - composition. At Riksbanken, our AI assistant uses five MCP servers:

```python
class AIChatApplication:
    def __init__(self):
        self.mcp_client = MCPClient()
        
        # Compose capabilities
        self.servers = [
            DatabaseServer(config.database),      # Financial data
            DocumentServer(config.documents),     # Policy documents  
            CalculationServer(config.models),     # Economic models
            BloombergServer(config.bloomberg),    # Market data
            NotificationServer(config.alerts)     # Action handling
        ]
        
    async def handle_query(self, query: str):
        # The LLM orchestrates across ALL servers
        context = await self.gather_context(query)
        response = await self.llm.complete(
            query, 
            available_tools=self.get_all_tools(),
            available_resources=self.get_all_resources()
        )
        return response
```

Each server is independent:
- **Deploy independently** - Update the database server without touching others
- **Scale independently** - More instances of heavy-use servers
- **Fail independently** - Bloomberg down? Others still work
- **Test independently** - Unit test each server in isolation

This is microservices architecture applied to AI systems."

## SLIDE 12: Security Architecture - Defense in Depth

**Visual**: Security layers diagram with threat model

**Script:**
"Security isn't an afterthought - it's architectural. MCP servers are your security boundary:

```python
class SecureMCPServer(Server):
    def authenticate(self, token: str) -> User:
        # Layer 1: Authentication
        user = validate_jwt(token)
        if not user:
            raise AuthenticationError()
        return user
        
    def authorize(self, user: User, resource: str) -> bool:
        # Layer 2: Authorization  
        return self.rbac.check_permission(user, resource)
        
    def validate_input(self, params: dict) -> dict:
        # Layer 3: Input validation
        return self.schema_validator.validate(params)
        
    def rate_limit(self, user: User, operation: str):
        # Layer 4: Rate limiting
        if not self.limiter.check_rate(user, operation):
            raise RateLimitError()
            
    def audit_log(self, user: User, operation: str, result: any):
        # Layer 5: Audit trail
        self.logger.log_security_event(user, operation, result)
```

This is defense in depth:
- **Never trust the LLM** - Validate everything
- **Principle of Least Privilege** - Minimal necessary access
- **Audit everything** - Full trail for compliance
- **Fail secure** - Errors default to denying access

At Riksbanken, this architecture passed security review for handling market-sensitive data."

---

# PART 3: ADVANCED PATTERNS & REAL APPLICATIONS (15 min)

## SLIDE 13: Stateful Operations - The Transaction Pattern

**Visual**: State diagram showing transaction flow

**Script:**
"Here's an advanced pattern we developed - stateful transactions across LLM calls:

```python
class TransactionalMCPServer(Server):
    def __init__(self):
        self.sessions = {}  # Session management
        
    @expose_tool("begin_transaction")
    async def begin_transaction(self, session_id: str) -> dict:
        self.sessions[session_id] = {
            'transaction': await self.db.begin(),
            'operations': [],
            'created_at': datetime.now()
        }
        return {"session_id": session_id, "status": "active"}
    
    @expose_tool("execute_in_transaction")
    async def execute(self, session_id: str, operation: dict) -> dict:
        session = self.sessions.get(session_id)
        if not session:
            raise ValueError("Invalid session")
            
        try:
            result = await self._execute_operation(
                session['transaction'], 
                operation
            )
            session['operations'].append(operation)
            return result
        except Exception as e:
            await self.rollback(session_id)
            raise
    
    @expose_tool("commit_transaction")  
    async def commit(self, session_id: str) -> dict:
        session = self.sessions.pop(session_id)
        await session['transaction'].commit()
        return {
            "committed": len(session['operations']),
            "duration": (datetime.now() - session['created_at']).seconds
        }
```

This enables complex workflows:
1. LLM starts transaction
2. Performs multiple operations
3. Validates results
4. Commits or rolls back

The LLM maintains transaction context across multiple reasoning steps - powerful!"

## SLIDE 14: Performance Patterns - Caching and Optimization

**Visual**: Performance metrics and caching architecture

**Script:**
"At scale, performance matters. Here's our caching pattern:

```python
class CachedMCPServer(Server):
    def __init__(self):
        self.cache = RedisCache()
        self.stats = PerformanceMonitor()
        
    @expose_resource("data://{key}")
    async def get_resource(self, key: str) -> Resource:
        # Try cache first
        cache_key = f"mcp:resource:{key}"
        cached = await self.cache.get(cache_key)
        
        if cached:
            self.stats.record_hit()
            return Resource.from_cache(cached)
            
        # Cache miss - fetch and store
        self.stats.record_miss()
        
        # Parallel fetch for related data
        async with asyncio.TaskGroup() as tg:
            main_task = tg.create_task(self.fetch_main(key))
            meta_task = tg.create_task(self.fetch_metadata(key))
            related_task = tg.create_task(self.fetch_related(key))
        
        result = self.build_resource(
            main_task.result(),
            meta_task.result(), 
            related_task.result()
        )
        
        # Adaptive caching based on access patterns
        ttl = self.calculate_ttl(key, self.stats.access_pattern(key))
        await self.cache.set(cache_key, result, ttl)
        
        return result
```

Results from production:
- 85% cache hit rate for common queries
- 10x reduction in database load
- Sub-100ms response times for cached resources

The LLM doesn't know about caching - it's transparent. Good abstraction!"

## SLIDE 15: Testing Strategy - Mocking and Verification

**Visual**: Testing pyramid for MCP servers

**Script:**
"Testing AI systems is hard. MCP makes it manageable:

```python
class TestDatabaseServer:
    @pytest.fixture
    def mock_server(self):
        # Create a mock MCP server for testing
        server = MockMCPServer()
        server.register_tool("query", 
            lambda q: {"rows": [{"id": 1}]})
        return server
        
    async def test_llm_integration(self, mock_server):
        # Test LLM behavior with mock server
        client = MCPClient(mock_server)
        llm = LLMWithMCP(client)
        
        response = await llm.complete(
            "How many users are in the system?"
        )
        
        # Verify the LLM called the right tool
        assert mock_server.call_history[0].method == "query"
        assert "COUNT(*)" in mock_server.call_history[0].params
        
    async def test_security_boundaries(self, mock_server):
        # Test that server rejects malicious queries
        with pytest.raises(SecurityError):
            await mock_server.execute_tool(
                "query",
                {"query": "DROP TABLE users;"}
            )
            
    async def test_performance_sla(self, mock_server):
        # Ensure response times meet SLA
        start = time.time()
        await mock_server.execute_tool("query", test_query)
        assert time.time() - start < 0.1  # 100ms SLA
```

Testing strategies:
- **Unit tests** - Each server method in isolation
- **Integration tests** - Server with real dependencies
- **Contract tests** - Protocol compliance
- **Chaos tests** - Failure scenarios
- **Load tests** - Performance under stress"

## SLIDE 16: Production Case Study - Riksbanken AI Assistant

**Visual**: Screenshot of actual system + architecture diagram

**Script:**
"Let me show you this in production. Our AI Policy Assistant at Riksbanken:

**Requirements:**
- Answer complex questions about monetary policy
- Access 20 years of historical documents
- Integrate real-time market data
- Generate reports for board meetings
- Full audit trail for compliance

**Architecture:**
- 5 MCP servers (documents, data, calculations, markets, reports)
- Load balanced across 3 instances each
- Redis caching layer
- PostgreSQL for audit logs
- Kubernetes deployment

**Results after 6 months:**
- 10,000+ queries processed monthly
- 92% user satisfaction rate
- 50% reduction in research time for analysts
- Zero security incidents
- 99.9% uptime

**Key lesson:** The modular architecture let us iterate. We started with 2 servers, added more as needs grew. We switched from GPT-4 to Claude without changing server code. We scaled the document server independently when load increased.

This flexibility comes from good design, not clever code."

## SLIDE 17: Common Pitfalls and How to Avoid Them

**Visual**: Anti-patterns vs patterns comparison

**Script:**
"Learn from our mistakes. Common pitfalls we encountered:

**Pitfall 1: Over-exposing capabilities**
❌ Bad: Expose raw SQL execution
✅ Good: Expose domain-specific queries

**Pitfall 2: Stateless assumption**
❌ Bad: Every call independent
✅ Good: Session management for complex workflows

**Pitfall 3: Trusting LLM output**
❌ Bad: Direct parameter passing
✅ Good: Schema validation + sanitization

**Pitfall 4: Blocking operations**
❌ Bad: Synchronous long-running tasks
✅ Good: Async with progress updates

**Pitfall 5: Ignoring errors**
❌ Bad: Generic error messages
✅ Good: Specific, actionable error responses

```python
# Good error handling
@expose_tool("analyze_data")
async def analyze(self, dataset: str) -> dict:
    try:
        data = await self.load_dataset(dataset)
    except DatasetNotFoundError:
        return {
            "error": "Dataset not found",
            "suggestion": "Available datasets: " + self.list_datasets(),
            "action": "Please specify a valid dataset name"
        }
    except PermissionError:
        return {
            "error": "Access denied",
            "reason": "Dataset requires elevated permissions",
            "action": "Request access from data.admin@riksbanken.se"
        }
```

The LLM can reason about errors and guide users - much better UX!"

---

# PART 4: IMPLICATIONS AND FUTURE (8 min)

## SLIDE 18: Architectural Implications

**Visual**: Evolution diagram showing progression of AI architectures

**Script:**
"MCP represents a shift in how we architect AI systems. We're moving from:

**Generation 1: Prompt Engineering**
- Everything in the prompt
- No tool use
- Limited by context window

**Generation 2: Function Calling**
- Vendor-specific implementations
- Tight coupling
- Integration chaos

**Generation 3: Protocol-Based (MCP)**
- Standardized interfaces
- Loose coupling
- Composable services

**Generation 4: What's next?**
- Multi-agent protocols?
- Distributed reasoning?
- Autonomous service discovery?

This evolution mirrors the web's evolution from static HTML to REST APIs to microservices. We're applying decades of software architecture wisdom to AI."

## SLIDE 19: Research Opportunities

**Visual**: Mind map of open research questions

**Script:**
"For those interested in research, MCP opens fascinating questions:

**Protocol Design:**
- How do we handle real-time streaming data?
- Can we formalize security properties?
- What about peer-to-peer agent communication?

**Performance:**
- Optimal caching strategies for LLM workloads?
- Predictive prefetching based on conversation flow?
- Distributed transaction protocols?

**Security:**
- Formal verification of MCP servers?
- Homomorphic encryption for sensitive data?
- Zero-knowledge proofs for compliance?

**Software Engineering:**
- Automatic MCP server generation from OpenAPI specs?
- Testing strategies for non-deterministic systems?
- Debugging tools for LLM-orchestrated workflows?

These aren't just AI problems - they're classical distributed systems challenges in a new context."

## SLIDE 20: Practical Takeaways for Your Projects

**Visual**: Actionable checklist with resources

**Script:**
"Let's make this practical. For your projects:

**If you're building an AI application:**
1. Start with clear separation - LLM for reasoning, MCP servers for capabilities
2. Design your domain model first - what are your Resources and Tools?
3. Security from day one - validate everything
4. Test with mocks - don't rely on LLM behavior

**If you're researching:**
1. Look at protocol extensions - streaming, transactions, discovery
2. Consider formal methods - can we prove properties?
3. Study failure modes - how do these systems degrade?

**Resources to explore:**
- MCP Specification: github.com/modelcontextprotocol/specification
- Example servers: github.com/modelcontextprotocol/servers
- Our Riksbanken patterns: [I'll share after talk]
- My LinkedIn articles on AI architecture

**Tools to try:**
- Claude Desktop with MCP support
- MCP SDK (Python/TypeScript)
- Mock server for testing"

---

# CLOSING (5 min)

## SLIDE 21: The Bigger Picture

**Visual**: Inspirational diagram connecting software design to AI future

**Script:**
"As software engineers, we often chase the newest technology. But today's lesson is different: good design is timeless.

The principles you're learning - modularity, abstraction, loose coupling - these aren't just academic concepts. They're the foundation for building the AI systems that will transform industries.

MCP isn't revolutionary because it's new. It's revolutionary because it applies proven principles correctly. It shows that the path to AI integration isn't through AI-specific magic, but through solid software engineering.

Whether you build the next banking system, healthcare platform, or something we haven't imagined yet, remember: complexity is managed through design, not cleverness."

## SLIDE 22: Q&A and Discussion

**Visual**: Your contact info, QR code for resources, "Let's discuss!"

**Script:**
"Now for the best part - your questions and ideas. 

I'm particularly curious about:
- What patterns do you see applying to your domains?
- What concerns do you have about this architecture?
- How would you extend MCP for your use cases?

And remember - I'm on LinkedIn, always happy to discuss software architecture, AI systems, or help with your projects. Especially if you're working on something that could benefit Swedish finance!

Who has the first question?"

---

# BACKUP SLIDES (If time or questions arise)

## BACKUP 1: Detailed JSON-RPC Examples

[Include specific message examples]

## BACKUP 2: Performance Benchmarks

[Include detailed metrics from Riksbanken]

## BACKUP 3: Cost Analysis

[Token usage, optimization strategies]

## BACKUP 4: Migration Strategy

[How to move existing systems to MCP]

## BACKUP 5: Comparison with LangChain

[Detailed technical comparison]

---

# SPEAKER NOTES

**Timing Guidelines:**
- Opening: 2 min
- Part 1: 10 min (architecture focus)
- Part 2: 15 min (heavy technical)
- Part 3: 15 min (real examples)
- Part 4: 8 min (forward looking)
- Q&A: 10 min (flexible)

**Key Themes to Reinforce:**
1. MCP is software engineering, not AI magic
2. Good design principles are universal
3. Real production examples from Riksbanken
4. Students can apply this today

**Interaction Points:**
- After Part 1: "Who has seen these anti-patterns?"
- During Part 2: "What design pattern does this remind you of?"
- After Part 3: "What would you add to this architecture?"

**Energy Management:**
- Start high energy with failure story
- Deep technical dive in middle
- Re-energize with production success
- End with inspiration and possibilities

**Swedish Context:**
- Reference local companies (Spotify, Klarna) when relevant
- Mention EU AI Act compliance considerations
- Connect to Swedish innovation tradition

**If Running Short on Time:**
- Skip Slide 14 (Performance)
- Reduce Part 4 to 5 minutes
- Keep Q&A to 5 minutes

**If Extra Time:**
- Add more Riksbanken examples
- Do live coding demo (have backup ready)
- Extended Q&A with whiteboard design session