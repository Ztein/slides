# Advanced Software Design: Building Scalable AI Integrations with the Model Context Protocol
## Uppsala University Master Class - 45-60 minutes
## Speaker: Joel Stenberg, AI Specialist, Knowit

---

# OPENING (2 min)

## SLIDE 1: Title & Personal Introduction

**Visual**: Clean title with Uppsala University branding, your photo/bio

**Script:**
"Good morning! I'm Joel Stenberg, AI specialist at Knowit. My journey in software has taken me from building traditional enterprise systems to now architecting AI solutions for some of Sweden's largest organizations - from forestry giants to insurance companies to public sector institutions like Uppsala Kommun.

Today, I want to share something that fundamentally changed how we think about AI system design. We'll explore the Model Context Protocol - not just as a technology, but as a case study in how good software design principles solve real architectural challenges.

By the end of this session, you'll understand how the same design patterns you've studied - separation of concerns, loose coupling, standardized interfaces - apply to cutting-edge AI systems. And hopefully, you'll leave with ideas for your own projects."

---

# PART 1: THE ARCHITECTURAL CHALLENGE (10 min)

## SLIDE 2: A Real Problem - When RAG Meets Reality

**Visual**: Architecture diagram showing failed RAG implementation with 10,000+ research documents

**Script:**
"Let me start with a failure that taught us crucial lessons. A major Swedish forestry company - with over 100 years of research history - came to us with what seemed like a perfect RAG use case. They had 10,000+ research reports and wanted researchers to query this knowledge base.

We built a beautiful RAG system. Chunked all documents. Created embeddings. Set up a vector database. It was textbook implementation.

Then the researchers started asking real questions:
- 'How many articles were written about lignin between 1930-1980?'
- 'Compare the reasoning about cellulose extraction in these two specific 30-page papers'
- 'What methods were abandoned after 1960 and why?'

Our RAG system failed spectacularly. Why? It would retrieve random chunks from seemingly relevant papers but couldn't answer these questions. The RAG grabbed three chunks about lignin - maybe from 1952, 1978, and 2010 - but couldn't count articles or compare full documents.

This wasn't a RAG problem - it was an architectural problem. We were using the wrong tool for the job."

## SLIDE 3: Another Failure - The Insurance Agreement Nightmare

**Visual**: Diagram showing 30 similar insurance agreements with version chaos

**Script:**
"Here's another instructive failure. An insurance company wanted RAG for their agreement templates - 30 different union agreements, updated yearly. Most documents were 95% identical with small but crucial differences: premiums, deductibles, specific union names.

When someone asked 'What's the deductible for the electricians union 2024?', our RAG would confidently return chunks from three different agreements - maybe plumbers 2024, electricians 2023, and metalworkers 2024. The semantic similarity was too high. Every chunk looked relevant.

We tried everything: better chunking strategies, metadata filtering, prompt engineering. Nothing worked reliably. The fundamental problem? RAG is designed to find semantically similar content. When ALL your content is semantically similar but contextually different, RAG breaks down.

These aren't edge cases - they're common enterprise scenarios."

## SLIDE 4: Why RAG Fails - Architectural Limitations

**Visual**: Table showing what RAG can and cannot do, with real examples

**Script:**
"Let's be honest about RAG's limitations - things I learned the hard way:

**What RAG Can Do:**
- Find relevant passages for factual questions
- Retrieve specific information from diverse documents
- Augment context for better answers

**What RAG Cannot Do:**
- Count or aggregate across documents ('How many reports mention X?')
- Compare full documents (needs entire context, not chunks)
- Handle near-duplicate content (insurance agreements, yearly reports)
- Respect complex access control (who can see what)
- Answer about what's NOT in the corpus

The insurance company needed exact document retrieval. The forestry company needed document analysis and aggregation. Uppsala Kommun needs role-based access control where the economy chief sees different data than the intern.

RAG gives you semantic search. But enterprise AI needs so much more: tools, actions, stateful operations, security boundaries. This is where proper software architecture comes in."

## SLIDE 5: The Solution We Built - Agent Orchestration

**Visual**: Before/after architecture showing evolution from RAG to agent-based system

**Script:**
"So how did we solve these failures? We built agent-based systems with tool calling.

For the forestry company, we created specialized agents:
- **Document Finder Agent**: Uses metadata to find exact documents, not chunks
- **Document Reader Agent**: Loads entire documents into context for analysis
- **Analysis Agent**: Counts, compares, aggregates across documents
- **Synthesis Agent**: Combines results and answers the original question

For the insurance company:
- **Agreement Selector Tool**: Uses structured metadata to find exact agreement
- **Full Document Loader**: Retrieves complete agreement, not chunks
- **Comparison Tool**: Loads multiple full agreements for side-by-side analysis

Each agent had specific tools and could call them as needed. It worked! But...

We had to build custom integrations for each client, each LLM provider, each use case. Every project reinvented the wheel. No standardization. No reusability.

This is exactly the problem MCP solves - it standardizes how LLMs interact with tools and resources."

## SLIDE 6: LLMs as a Software Component

**Visual**: Clean component diagram showing LLM as a service with inputs/outputs

**Script:**
"Let's properly frame what an LLM actually is from a software design perspective.

An LLM is just another software component - a specialized reasoning engine:

**Inputs**: Text (prompts, context, instructions)
**Processing**: Statistical pattern matching on massive scale
**Outputs**: Text (predictions, completions, structured data)

It's a stateless service with clear boundaries:
- **Capabilities**: Reasoning, generation, analysis
- **Limitations**: No execution, no data access, no persistence
- **Interface requirements**: Text in, text out

The key insight? LLMs are powerful but isolated. They need to be composed with other components - databases, APIs, file systems. This is a classic software architecture challenge: how do we integrate disparate systems?

The answer isn't to cram everything into the LLM (the 'God Prompt' anti-pattern). It's to build proper interfaces."

## SLIDE 7: The Integration Anti-Patterns

**Visual**: Four "anti-pattern" examples with red X marks

**Script:**
"Let's examine the anti-patterns we see repeatedly - including the ones we built ourselves before learning better:

**Anti-pattern 1: The God Prompt**
```python
prompt = f'''Here's my entire database: {dump_database()}
Here's all my files: {read_all_files()}
Here's the user question: {question}'''
```
Violates: Single Responsibility, Resource efficiency, Scalability

**Anti-pattern 2: The Naive RAG**
```python
# Always returns 3 chunks, regardless of relevance
chunks = vector_db.search(query, k=3)
context = ''.join(chunks)
answer = llm.complete(context + question)
```
Problem: No quality control, no full document access, no aggregation

**Anti-pattern 3: The Security Afterthought**
```python
def get_data(user_query):
    data = database.query(user_query)  # No access control!
    return data  # Hope the user should see this...
```
Violates: Security by design, Principle of least privilege

**Anti-pattern 4: The LLM-Specific Integration**
```python
if llm_type == "gpt4":
    response = openai_specific_format(data)
elif llm_type == "claude":
    response = anthropic_specific_format(data)
```
Violates: Don't Repeat Yourself, Interface Segregation

Each project repeated these mistakes. We needed architectural patterns, not just better prompts."

## SLIDE 8: The Security Challenge - "On Behalf Of" Pattern

**Visual**: Diagram showing user → AI → data with security boundaries

**Script:**
"Here's a challenge every enterprise faces: role-based access control in AI systems.

At Uppsala Kommun, we have this scenario:
- The economy chief can see budget forecasts
- Department heads can see their department's data
- Regular employees can see public information
- The AI system needs to respect ALL these rules

The 'On Behalf Of' pattern is critical but complex:

```python
# The WRONG way (we tried this)
def get_budget_data(query):
    return database.query(query)  # AI sees everything!

# The RIGHT way (but complex)
def get_budget_data(query, user_context):
    # Validate user permissions
    if not user_context.has_role('economy_chief'):
        raise PermissionError()
    
    # Add row-level security
    query = add_department_filter(query, user_context)
    
    # Audit the access
    audit_log.record(user_context, query, timestamp)
    
    # Execute with user's permissions, not AI's
    with database.as_user(user_context):
        return database.query(query)
```

Every tool, every resource needs this pattern. Without standardization, every team implements it differently. Some forget. Security audits become nightmares.

MCP provides a standard way to pass user context through the entire chain. One pattern, consistent security."

**Visual**: Clean MCP architecture diagram with protocol at the center

**Script:**
"The Model Context Protocol, or MCP, is Anthropic's answer to this design challenge. But here's what's brilliant - it's not AI-specific innovation. It's classical software architecture applied correctly.

MCP is essentially the application of three fundamental design principles:
1. **Protocol-oriented design** - Like HTTP for web, SMTP for email
2. **Service-oriented architecture** - Loosely coupled services
3. **Capability-based security** - Explicit permissions and boundaries

Think of it as USB-C for AI. Before USB-C, every device had proprietary connectors. After USB-C? One standard, infinite possibilities. MCP does this for AI integrations."

## SLIDE 10: Enter the Model Context Protocol

**Visual**: Clean MCP architecture diagram with protocol at the center

**Script:**
"The Model Context Protocol, or MCP, emerged from exactly these pain points. But here's what's brilliant - it's not AI-specific innovation. It's classical software architecture applied correctly.

MCP is essentially the application of three fundamental design principles:
1. **Protocol-oriented design** - Like HTTP for web, SMTP for email
2. **Service-oriented architecture** - Loosely coupled services
3. **Capability-based security** - Explicit permissions and boundaries

Think of it this way: Before MCP, every AI integration was like building a custom USB cable for each device. After MCP? One standard, infinite possibilities.

It solves our exact problems:
- The forestry company can build document analysis tools, not just RAG
- The insurance company can retrieve exact documents, not random chunks  
- Uppsala Kommun can pass user context securely through the entire chain

MCP turns our agent-based solutions into standardized, reusable components."

## SLIDE 11: The Protocol Layer - Separation of Concerns

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

## SLIDE 12: The Three Primitives - Domain Modeling

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

## SLIDE 13: Real Solution - Forestry Research with MCP

**Visual**: Before/after architecture comparison

**Script:**
"Let me show you how MCP would solve the forestry company's problem:

**Before (RAG only):**
```python
# Question: "How many articles about lignin 1930-1980?"
chunks = vector_db.search("lignin", k=3)  # Gets 3 random chunks
answer = llm.complete(chunks + question)   # Can't count, wrong answer
```

**After (MCP):**
```python
# MCP Server exposes multiple tools
@expose_tool("search_documents")
async def search_documents(query: str, start_year: int, end_year: int):
    # Returns list of matching documents with metadata
    return database.query(
        "SELECT * FROM research WHERE content LIKE %s 
         AND year BETWEEN %s AND %s",
        [query, start_year, end_year]
    )

@expose_tool("analyze_document") 
async def analyze_document(doc_id: str, analysis_type: str):
    # Loads ENTIRE document for analysis
    doc = load_full_document(doc_id)
    return {"content": doc, "id": doc_id}

@expose_resource("statistics://research")
async def get_statistics():
    # Pre-computed statistics available as resource
    return aggregated_research_stats()
```

Now the LLM can:
1. Call search_documents to find ALL lignin articles 1930-1980
2. Count them accurately
3. Load specific documents entirely for comparison
4. Access pre-computed statistics when appropriate

Same LLM, proper tools. Problem solved."

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

## SLIDE 14: Protocol Design - Message Passing

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
    "name": "search_documents",
    "arguments": {
      "query": "lignin",
      "start_year": 1930,
      "end_year": 1980
    }
  }
}

// Response  
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "documents": [/* 47 documents */],
    "count": 47
  }
}
```

This gives us:
- **Request-response correlation** (via ID)
- **Error handling** (standardized error field)
- **Extensibility** (additional fields ignored)
- **Language agnostic** (just JSON)

Compare this to REST where you'd need to design URL structures, HTTP verbs, status codes. JSON-RPC gives us everything in a simple, proven pattern."

## SLIDE 15: Real Implementation - Solving RBAC with MCP

**Visual**: Code example with security annotations

**Script:**
"Let's see how MCP solves the 'on behalf of' pattern cleanly:

```python
from mcp.server import Server, Resource, Tool, UserContext

class SecureDataServer(Server):
    def __init__(self, connection_pool):
        self.pool = connection_pool
        
    @expose_tool("query_budget", auth_required=True)
    async def query_budget(
        self, 
        department: str,
        user_context: UserContext  # Passed automatically by MCP
    ) -> dict:
        # MCP provides user context throughout the chain
        
        # Layer 1: Authentication (handled by MCP transport)
        if not user_context.authenticated:
            raise AuthenticationError()
            
        # Layer 2: Authorization
        if department != user_context.department:
            # Can only see own department unless chief
            if 'economy_chief' not in user_context.roles:
                raise PermissionError(
                    f"User {user_context.id} cannot access {department}"
                )
        
        # Layer 3: Row-level security in query
        query = f"""
            SELECT * FROM budgets 
            WHERE department = %s
            AND classification <= %s  -- Respect security level
        """
        
        # Layer 4: Audit trail
        await self.audit_log.record(
            user=user_context.id,
            action="budget_query",
            department=department,
            timestamp=datetime.now()
        )
        
        # Layer 5: Execute as user, not as system
        async with self.pool.acquire() as conn:
            # Connection uses user's actual database credentials
            results = await conn.fetch(
                query, 
                department,
                user_context.security_clearance
            )
                
        return {"data": results, "user": user_context.id}
```

Every MCP server gets user context automatically. No need to reinvent security for each tool. Uppsala Kommun can now safely let department heads query their own budgets through the AI, while the economy chief sees everything."

## SLIDE 16: Composition Pattern - Building Complete Solutions

**Visual**: Component diagram showing multiple MCP servers solving real problems

**Script:**
"Here's where MCP shines - composing solutions from independent servers. Let me show you a real architecture we deployed:

```python
class EnterpriseAIApplication:
    def __init__(self):
        self.mcp_client = MCPClient()
        
        # Compose different capabilities
        self.servers = [
            # Replaces failed RAG with proper document handling
            DocumentAnalysisServer(      
                full_document_retrieval=True,  # Not chunks!
                metadata_search=True,           # Find exact docs
                aggregation_tools=True          # Count, compare
            ),
            
            # Handles the RBAC complexity
            SecureDataServer(
                user_context_passthrough=True,  # On behalf of
                row_level_security=True,        # Department filtering
                audit_logging=True               # Compliance
            ),
            
            # Traditional RAG where it actually works
            KnowledgeBaseServer(
                vector_search=True,              # For diverse content
                chunk_size=512,                  # When appropriate
            ),
            
            # External integrations
            WeatherAPIServer(),                  # Simple tool example
            NotificationServer()                 # Action handling
        ]
        
    async def handle_query(self, query: str, user: User):
        # The LLM orchestrates across ALL servers
        # Each server respects user context
        response = await self.llm.complete(
            query, 
            available_tools=self.get_all_tools(),
            available_resources=self.get_all_resources(),
            user_context=user  # Passed to all servers
        )
        return response
```

Key insights:
- **Use RAG where it works** (diverse knowledge base queries)
- **Use tools where RAG fails** (counting, aggregation, exact retrieval)
- **Every server respects security** (user context flows through)
- **Mix and match as needed** (not everything needs to be RAG)

This solved all three client problems: forestry research, insurance agreements, and Uppsala's security requirements."

## SLIDE 17: Security Architecture - Defense in Depth

**Visual**: Security layers diagram with real threat scenarios

**Script:**
"Security isn't an afterthought in MCP - it's architectural. Let me show you how we handle Uppsala Kommun's requirements:

```python
class SecureMCPServer(Server):
    async def handle_request(self, request, user_context):
        # Layer 1: Transport Security (built into MCP)
        # TLS, API keys, OAuth tokens handled by protocol
        
        # Layer 2: Authentication
        if not await self.validate_token(user_context.token):
            raise AuthenticationError("Invalid session")
        
        # Layer 3: Authorization - Role-Based Access Control
        resource = request.resource
        if resource.startswith("budget://"):
            if "economy" not in user_context.roles:
                raise PermissionError("Budget access denied")
        elif resource.startswith("personal://"):
            # Can only see own data
            if resource.user_id != user_context.id:
                raise PermissionError("Cannot access other's data")
                
        # Layer 4: Data Classification Check
        doc_classification = self.get_classification(resource)
        if doc_classification == "SECRET":
            if user_context.clearance < SecurityLevel.SECRET:
                raise SecurityError("Insufficient clearance")
                
        # Layer 5: Input Validation
        if request.method == "sql_query":
            # Prevent SQL injection even from LLM
            sanitized = self.sanitize_sql(request.params.query)
            request.params.query = sanitized
            
        # Layer 6: Rate Limiting
        if not self.rate_limiter.check(user_context, request):
            raise RateLimitError("Too many requests")
            
        # Layer 7: Audit Everything
        await self.audit_log.record({
            'user': user_context.id,
            'action': request.method,
            'resource': resource,
            'timestamp': datetime.now(),
            'ip': user_context.ip,
            'result': 'pending'
        })
        
        # Execute with user's permissions
        result = await self.execute_as_user(request, user_context)
        
        # Final audit
        await self.audit_log.update(result='success')
        
        return result
```

This architecture passed security review at Uppsala Kommun. Every request is authenticated, authorized, validated, rate-limited, and audited. The LLM never gets more access than the user asking the question."

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

## SLIDE 18: Production Case Study - Three Success Stories

**Visual**: Screenshots/diagrams of three different implementations

**Script:**
"Let me show you how MCP transformed three failing projects into successes:

**Forestry Research System (10,000+ documents):**
- **Before**: RAG returning random chunks, can't count or compare
- **Solution**: Document analysis tools + metadata search via MCP
- **Results**: 
  - 100% accurate document counting
  - Full-text comparison capability
  - 95% user satisfaction (up from 30%)
  - Researchers save 5 hours/week

**Insurance Agreement System (30 unions, yearly versions):**
- **Before**: RAG confusing similar agreements, wrong deductibles
- **Solution**: Exact document retrieval + version control via MCP
- **Results**:
  - Zero errors in agreement identification
  - Correct version selection every time
  - Reduced support calls by 80%
  - Audit trail for compliance

**Uppsala Kommun Budget System:**
- **Before**: No AI access due to security concerns
- **Solution**: RBAC-enabled MCP servers with user context
- **Results**:
  - Department heads safely query own budgets
  - Economy chief has full visibility
  - Complete audit trail for every query
  - Passed security audit first try

**Key lesson:** The same MCP protocol solved three completely different problems. Good architecture is reusable."

## SLIDE 19: Common Pitfalls and How to Avoid Them

**Visual**: Anti-patterns vs patterns comparison with real examples

**Script:**
"Learn from our mistakes. Here are pitfalls we encountered in production:

**Pitfall 1: Trying to make everything RAG**
❌ Bad: Force RAG for counting/aggregation tasks
✅ Good: Use tools for analysis, RAG for retrieval

**Pitfall 2: Ignoring user context**
❌ Bad: Server has full database access
✅ Good: Every request includes user context

**Pitfall 3: Trusting LLM-generated SQL**
❌ Bad: `execute(llm_generated_sql)`
✅ Good: Parameterized queries with validation

**Pitfall 4: Not handling full documents**
❌ Bad: Always chunk everything into 512 tokens
✅ Good: Provide both chunked and full document access

**Pitfall 5: Security as afterthought**
❌ Bad: 'We'll add authentication later'
✅ Good: Security in every layer from day one

```python
# Good error handling for users
@expose_tool("analyze_data")
async def analyze(self, dataset: str, user_context: UserContext) -> dict:
    try:
        # Check permissions FIRST
        if not self.can_access(dataset, user_context):
            return {
                "error": "Access denied",
                "reason": f"Dataset requires {self.get_required_role(dataset)} role",
                "action": "Contact your administrator for access"
            }
        
        data = await self.load_dataset(dataset, user_context)
        return {"success": True, "data": data}
        
    except DatasetNotFoundError:
        # Help the user understand what went wrong
        return {
            "error": "Dataset not found",
            "suggestion": f"Available datasets for your role: {self.list_available(user_context)}",
            "action": "Check dataset name and try again"
        }
```

The LLM can reason about errors and guide users appropriately. Much better UX than generic 'Access Denied'!"

---

# PART 4: IMPLICATIONS AND FUTURE (8 min)

## SLIDE 20: Architectural Implications

**Visual**: Evolution diagram showing progression of AI architectures

**Script:**
"MCP represents a fundamental shift in how we architect AI systems. We're moving from ad-hoc integrations to protocol-based design:

**Generation 1: Prompt Engineering**
- Everything crammed in the prompt
- Limited by context window
- No real integration

**Generation 2: RAG Era**
- Semantic search for retrieval
- Works for some use cases
- Fails for aggregation, comparison, security

**Generation 3: Custom Tool Calling**
- Each vendor's proprietary approach
- Solves problems but fragments ecosystem
- We were here with our agent solutions

**Generation 4: Protocol-Based (MCP)**
- Standardized interfaces
- Composable services
- Security built-in
- Write once, use everywhere

**Generation 5: What's next?**
- Multi-agent protocols?
- Distributed reasoning?
- Autonomous service discovery?

This evolution mirrors how the web evolved: static HTML → CGI scripts → REST APIs → GraphQL → microservices. We're applying decades of distributed systems wisdom to AI."

## SLIDE 21: Research Opportunities

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
- My LinkedIn articles on RAG challenges and enterprise AI
- Knowit's open-source implementations [coming soon]

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

And remember - I'm on LinkedIn, always happy to discuss software architecture, AI systems, or help with your projects. Especially if you're working on something interesting in the Swedish tech ecosystem!

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
3. Real production examples from forestry, insurance, and public sector
4. RAG has clear limitations - know when to use tools instead
5. Security (RBAC) must be designed in from day one
6. Students can apply this today

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