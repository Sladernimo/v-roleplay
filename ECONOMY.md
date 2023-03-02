# Economy Information

### Basic Information
Each server has it's own independent economy with simulated inflation and is designed to slowly self-repair over time, assuming nothing is affecting it too heavily.

---

### Asset Ownership
Any player or clan is allowed to own as many businesses, vehicles, and houses as they want. However, it should be noted that the more you own, the more upkeep (via taxes, insurance, etc) is required. Failure to maintain this upkeep for too long will automatically force you to lose the unmaintained assets. Vehicle owners can park their car anywhere (subject to IC parking laws), store items in the trunk or dash compartment, give anybody access, and set the price if they want to make it available to buy, and more. Business owners can stock their store with any item they want, set what prices they want for any item for sale, close/open the business, keep a stock of items in the business's storage, force people to pay a fee to enter, and more. House owners can store items in their house, purchase a safe, decorate with furniture, give anybody access, and more.

---

### Ordering Items for a Business
Ordering items is simple: just use the /bizorder command. 
You'll need to specify which item you want to order and how many. 
Remember, the prices will vary depending on certain circumstances.  

The formula is as follows:
> Base price * server inflation * demand * risk * amount  

**Here's a breakdown on how the above formula works:**   
* First, each item has a base price. This value will never change.  

* Next, the base price is multiplied by the server's current inflation value. When the servers were first opened, the inflation value is 100%, which means no inflation. Everything cost 100% of it's calculated price. However, the inflation will slowly increase over time, simulating realistic economy inflation.  

* Next, the inflated price is then multiplied by the demand factor, which is determined by how much demand there is for the item you want. Every 10 of the item ordered increases the demand value by 10%, and this will slowly go back down over time. If another business just ordered 100 of the item you want, the demand has forced the item's order price to increase by 100%, which means it's now double the original price. This simulates the things involved with increased demand, such as the extra manufacturing and shipping needed to get this item imported to your business.  

* Next, the cost is multiplied by a risk value. This value never changes, and varies depending on the item. For illegal items, the risk value will be lower for less-risky items and higher as they get worse. For example, a shotgun versus an AK-47 have different risk levels, as an AK-47 is a far deadlier and a harder to get weapon, and is more difficult to conceal through customs. This simulates the "risk" of ordering items like these. For legal items, there is no risk so the risk price won't increase for those.  

* Finally, the order cost is multiplied by the amount you want to order. 


**An example of this formula in action is below ... shown for an order for 10 AK-47's with no inflation**  
*The demand is increased by 10% since you're ordering 10 of them. 1 = 100% of the normal cost, 1.1 = 110%, and so on.*
> Base price $1000  
> x inflation 1 = $1000  
> x demand 1.1 = $1100  
> x risk 5 = $5500  
> x amount 10 = $55000

So as you can see, the total cost to order 10 AK-47's in this scenario is $55,000. Remember, an AK-47 is a deadly and uncommon weapon (and highly illegal!) so it's a very risky and costly thing to do business with.
