* If your reading this on vscode you can press Option + Z to make the text wrap.

# July 7th 2024
## Thinking about the metadata tree
The search function in the base metadata tree searches the tree for a node given a description or question.

Throughout the search, we mark nodes as visited or unviable. 
If we fully explore a branch we will navigate back up the tree to try other paths.
If we exhaust all paths, we will call a fallback method. For example, in the action tree this can be to create a new action. Or in the memory metadata tree it will be to browse the internet or ask the user questions.

Memory nodes however are unique, in the sense that in addition to searching existing nodes, every memory node type also has a toolset that can be searched. This toolset in itself is a metadata tree - every memory node type has an associated tool metadata tree. There are two types of tool in memory: Exploratory & Interactive tools. Exploratory tools simply return information to assist you in your search. Interactive tools will create a new memory node, with the relationship between them being the tool called with the given inputs. Now we can imagine such a scenario where before resorting to tools, a node is overlooked because it's description isn't clear enough, and then 

Resorting to searching the tool metadata tree can be thought of as a fallback at the memory node level. However action metadata trees don't have a need for node level fallback. So node level fallback should be optional.

There's also two more considerations that need to be made.
A search needs to return what? The raw sources, or an answer to a question? LLMs operate upon strings - a memory search should return a string.

An answer can come from multiple sources. During search we maintain:
- The original questions
- Current questions we need to answer
- New questions that arise during search
- Our current answer
- Nodes we have marked as visited or unviable

New questions that arise during a search will spawn a new search node to start a new search process from the root. We don't continue the search in the same search because answers could potentially be in nodes we already marked.

When we create a new node might we want to potentially update the docs? This could vary from repository to repository. For now this sort of functionality can be put on hold - we'll worry about this later. 

By default when we create a new node we do need to generate a description and title for it. Other things like updating docs can be an additional optional parameter we add later. In addition when using tools we need to create a hash of [tool_id, tool_args]. This is because it's possible to miss a node in navigation and then call a tool for a node that already exists that we just didn't navigate to during search.

We also want to decouple the logic for swarm nodes from metadata trees entirely. This seperation of concern will ensure that I'll be able to easily seperate the metadata tree objects into their own seperate package in the future. I do believe that the concept of metadata trees are quite general and I'd like to create another open source repository specifically for it.
So what sort of stuff do we have to reconcile in terms of the swarm node? I think if we want to make the development experience easier we should load the entire metadata tree into memory. However this means we'd also want to load all the tool trees into memory and decouple actions from metadata trees. Let's avoid thinking about developer experience seperate from swarmstar for now and focus on building this for swarmstar.

## Thinking about the router
The router can:
- Choose the best option
- Rank the options
- Mark options as unviable
Or any combination of these. Lets go with a combination of 1 and 3.

In addition tool routing is different. The router expects to be passed only viable options. After choosing a tool it might retry multiple times to choose the right parameters to call the tool with. This process should be seperate from routing. At a certain point we can mark a tool as unviable or visited depending on how the parameter generation and tool use process goes. Then we can continue with the same process of moving up the tree and continuing search.

## Thinking about search within search
While searching for answers to one set of questions, new questions may arise. We mention previously that to answer newly arised questions we should start a new search from root. This is because a new set of questions may have answers in nodes that already marked visited/unviable in the current search process. A new point I want to raise is that when new questions arise, should we immediately thereafter begin a new search or should we wait until we exhaust the entire tree than start the new search? There's arguments for both.

1. Begin new search immediately after new questions arise
Pros:
- Newly arised questions may need immediate answers. They are most likely being asked because they are blocking the immediate search process.

Actually we need to go no further with this line of reasoning - the above point is correct. Now the next question to ask is, upon completing the new search and coming back to the original search, do we continue search with the original state of unviable/visited nodes? Or do we restart the search from the root? 
The answer to this lies in a new question: Could new answers to new questions raised during the original search potentially make nodes already marked visited/unviable viable once again?
One line of thought is, yes, new answers could potentially make previously marked nodes viable again. For example, consider a scenario where during the original search, a node is marked unviable because it lacks certain information. A new question arises, leading to a new search that provides the missing information. With this new information, the previously unviable node may now be relevant and should be reconsidered. Therefore, upon completing the new search, we should restart the original search from the root, but with the updated context and knowledge gained from the new search.
On the other hand, when are questions answered and marked as unviable? Nodes are marked as unviable during routing based off descriptions. It is possible for descriptions to be updated during a search. But these updated descriptions would be in the context of the new questions not the original questions. Could updated descriptions due to the new questions have informational similarity that would cause unviable nodes that are actually viable nodes to the original questions to seem viable to the router? This seems possible but unlikely to me. Secondly, the timing and order of question asking is of relevance here. Questions are asked when an LLM has found a node they believe to be of potential value to their original questions. These questions should be answered, than passed back to that exact moment allowing that search to continue from where it currently is without break.

For this reason, I am conflicted - the answer is not clear. Considering the potential for new information to change the viability of nodes, it may be prudent to restart the original search from the root with the updated context and knowledge gained from the new search. However, this would disrupt the flow of the original search.

To balance both approaches:
- Answers to new questions will be passed to the immediate place where they were asked, allowing the search to resume with the updated context.
- If the entire tree is exhausted and there are still remaining questions, restart the search from the root with the updated context.
- If no new questions are asked and the tree is exhausted, use the fallback method.

This way, we maintain the flow of the original search while ensuring that all potential paths are explored with the most current information.

## Thinking about input and output of search
### Input
The simplest input to search is a single string containing questions and context. Another option is an object containing a list of questions and the context. However there's no real benefit from that - regardless of the shape of the input the final step of search is looking at the answer and input and asking, "Are all the questions answered? If not output the remaining questions." With a list of questions we can in a structured matter use a router to select the unanswered questions. We'll also be able to maintain a list original and unanswered questions - so on second thought yes we use the structured input actually.

There is still yet a second consideration though. What about the scenario where the LLM is writing code or working on some specific area of the memory tree? Actually given our design on first thought it appears this edge case is covered nicely - give an optional parameter allowing you to choose where search start from. In this manner the LLM can then navigate up or down as needed but starting out in the most relevant area of memory. Yay!

### Output
We can imagine searches that expect different results. Asking questions will expect a string answer. However in the first step of writing code the decision is choosing the file to edit. When writing code you also want not a written response by an LLM but to actually also see the relevant code as it is. In terms of returning the actual code that can be part of tooling. But how do we return the file to edit? We'd have to return the memory metadata node. We can have a boolean here to switch between string versus memory node reference output.

# June 27th 2024
This is the second version of https://github.com/BrianP8701/swarmstar
The space of possible codebases, with their different languages, setup, environments, testing and the millions of other vectors makes creating a general solution much harder. Focusing on building a code gen system for a single codebase reduces the complexity involved by many orders of magnitude.
