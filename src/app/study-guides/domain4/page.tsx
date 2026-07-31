type Block =
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "trap"; text: string }
  | { type: "key"; text: string }
  | { type: "subtitle"; text: string }
  | { type: "text"; text: string }
  | { type: "bullet"; items: string[] };

type Section = { title: string; color: string; content: Block[] };

const sections: Section[] = [
  {
    title: "Domain Overview",
    color: "#7B3F9E",
    content: [
      { type: "table", headers: ["Topic Area", "Key Subtopics", "Exam Weight"],
        rows: [
          ["Menu Development", "Menu types, menu engineering (Stars/Plow Horses/Puzzles/Dogs), menu planning principles", "High"],
          ["Procurement & Receiving", "Bid process, specifications, vendors, receiving procedures, FOB terms", "High"],
          ["Inventory Management", "FIFO/LIFO, ABC classification, perpetual vs physical, turnover, EOQ, reorder point", "High"],
          ["Production Systems", "Conventional, ready-prepared, commissary, assembly-serve — comparison", "High"],
          ["Food Distribution & Service", "Centralized vs decentralized, tray service, service styles", "Medium"],
          ["HACCP & Food Safety", "7 principles, CCPs, temperature control, pathogen-specific requirements", "Very High"],
          ["Sanitation", "Sanitizers comparison, warewashing, personal hygiene, pest control", "High"],
          ["Equipment & Facility", "Oven types, fryers, materials (stainless steel grades), flooring, lighting", "Medium"],
          ["Sustainability", "Water/energy conservation, waste management, green purchasing, carbon footprint", "Lower"],
          ["Financial Calculations", "Food cost, depreciation, forecasting methods, inventory valuation", "High"],
        ]},
    ]
  },
  {
    title: "SECTION 1: MENU DEVELOPMENT",
    color: "#7B3F9E",
    content: [
      { type: "subtitle", text: "1.1 Menu Types — Complete Comparison" },
      { type: "table", headers: ["Menu Type", "Description", "Advantages", "Disadvantages", "Best Used In"],
        rows: [
          ["Static (Fixed)", "Same menu offered every day; items rarely change", "Simple to manage; consistent purchasing and production; customers know what to expect; low training costs", "Monotony for repeat customers; no seasonal flexibility; menu fatigue over time", "Fast food chains; coffee shops; operations with low repeat customer volume"],
          ["Cycle", "Menu rotates on a set schedule (typically 7, 14, or 21 days) then repeats", "Reduces menu fatigue vs static; allows seasonal adjustments; standardizes purchasing (buy in bulk by cycle); production planning easier; reduces labor for meal planning", "More complex than static; if cycle is too short, repeat customers notice; requires more recipe variety", "Hospitals, long-term care facilities, schools, corrections — anywhere with captive repeat audiences"],
          ["Single-Use (Non-Recurring)", "Created for one specific occasion; not repeated", "Maximum creativity; perfectly matched to specific event and guests", "High planning time per event; cannot standardize purchasing; high food waste risk", "Banquets, catered events, special occasions, fundraising dinners"],
          ["A la Carte", "Each menu item priced and ordered separately; maximum customer choice", "High customer satisfaction; flexible; each item must stand on its own profitability", "Complex ordering; high food cost (less ability to cross-utilize ingredients); labor intensive", "Upscale restaurants; hotel room service; venues where customization is the selling point"],
          ["Table d'hote (Prix Fixe)", "Complete meal at a fixed price; limited choices within each course", "Predictable food cost; simplified production; higher perceived value; easier purchasing", "Less customer flexibility; must appeal to broad tastes; limited ability to accommodate restrictions", "Formal dining; special event dinners; prix fixe restaurants; some healthcare tray service"],
          ["Du Jour (Daily Special)", "Menu changes daily based on seasonal availability, chef creativity, or specials", "Excellent use of seasonal/surplus ingredients; keeps menu fresh; showcases creativity; can reduce food waste", "High planning time daily; inconsistent purchasing; staff must memorize or communicate daily changes", "Upscale restaurants; farm-to-table concepts; high-end hotel dining"],
          ["Selective (Patient Menu)", "Patients choose from multiple options for each meal component", "Improves patient satisfaction and intake; accommodates preferences and restrictions; reduces plate waste", "Complex production; multiple items to prepare; requires patient cooperation; more expensive", "Hospitals (room service model); long-term care; senior living — wherever patient satisfaction and intake are priorities"],
        ]},
      { type: "key", text: "Cycle menus are the gold standard for captive audiences (hospitals, schools, prisons) because they balance variety with operational efficiency. The cycle length should be long enough that repeat residents/patients do not notice the repetition." },
      { type: "subtitle", text: "1.2 Menu Engineering — Boston Matrix" },
      { type: "text", text: "Menu engineering analyzes each menu item's POPULARITY (number sold as % of total items sold) and PROFITABILITY (contribution margin = selling price - food cost) to determine strategic action." },
      { type: "table", headers: ["Category", "Popularity", "Profitability (CM)", "Strategic Action", "Examples"],
        rows: [
          ["STAR", "HIGH (above average popularity)", "HIGH (above average contribution margin)", "KEEP and PROTECT; feature prominently on menu; maintain quality and portion; do not change price unnecessarily; train staff to sell", "Signature items; customer favorites that also make money; most valuable menu items"],
          ["PLOW HORSE", "HIGH popularity (sells well)", "LOW contribution margin (not very profitable)", "INCREASE PROFITABILITY without reducing sales; slightly raise price; reduce portion size; substitute less expensive ingredients; pair with high-margin items; move to less prominent menu position", "Loss leaders; items that bring customers in but do not generate profit; popular comfort foods with high food cost"],
          ["PUZZLE", "LOW popularity (does not sell well)", "HIGH contribution margin (profitable when ordered)", "INCREASE SALES; reposition on menu; rename; add description/photography; server upselling; bundle with popular items; investigate WHY it does not sell (price? placement? description?)", "Items that make money when ordered but are overlooked; may be priced too high or poorly described"],
          ["DOG", "LOW popularity", "LOW contribution margin", "ELIMINATE or REDESIGN; if kept, must have strategic reason (rounding out menu, dietary accommodation); do not invest resources in promoting dogs", "Items that neither sell well nor make money; dead weight on the menu; removal simplifies production without losing revenue or customers"],
        ]},
      { type: "trap", text: "Menu engineering is based on CONTRIBUTION MARGIN (selling price - variable food cost per item), NOT food cost percentage. An item with a low food cost % but low selling price may have lower contribution margin than a high food cost % item with a high selling price. The exam tests this distinction." },
      { type: "subtitle", text: "1.3 Menu Planning Principles" },
      { type: "bullet", items: ["Nutritional adequacy: meals must meet DRI/dietary guidelines for target population", "Variety: colors, textures, flavors, cooking methods should vary across and within meals", "Food cost control: plan around seasonal availability, volume purchasing opportunities, cross-utilization of ingredients", "Operational feasibility: match menu complexity to available staff skills, equipment capacity, and production time", "Customer preferences and cultural considerations: reflect the population served", "Regulatory compliance: meet USDA meal pattern requirements if federally funded; meet therapeutic diet restrictions", "Leftover and waste management: plan for ingredient utilization across cycle to minimize waste"] },
    ]
  },
  {
    title: "SECTION 2: PROCUREMENT & RECEIVING",
    color: "#7B3F9E",
    content: [
      { type: "subtitle", text: "2.1 Procurement Process — 5 Steps" },
      { type: "table", headers: ["Step", "Action", "Key Decisions/Tools"],
        rows: [
          ["1. Develop specifications", "Write detailed written descriptions of product quality, quantity, packaging, and delivery requirements", "Purchase specifications: grade, brand, size, pack, yield, trim; As-Purchased (AP) vs Edible Portion (EP); yield % = EP/AP x 100"],
          ["2. Identify potential sources", "Research suppliers who can meet specifications; consider primary vs secondary suppliers", "Local vs national suppliers; GPO membership; prime vendor agreements; distributors vs manufacturers"],
          ["3. Contact sources and obtain price quotes", "Formal (sealed bid/RFP) or informal (verbal quotes) solicitation depending on purchase size", "Formal bids required above threshold (typically $5,000-$25,000); request for proposal (RFP); request for quotation (RFQ)"],
          ["4. Evaluate bids and select supplier", "Compare bids on price, quality, reliability, delivery schedule, service, and relationship", "Lowest bid is NOT always best; consider total cost of ownership; reliability; quality consistency; payment terms"],
          ["5. Place order and establish purchase records", "Issue purchase order (PO); document what was ordered, from whom, at what price, by when", "Purchase order is legal contract; blanket purchase orders for ongoing needs; standing orders for daily deliveries"],
        ]},
      { type: "subtitle", text: "2.2 Types of Suppliers" },
      { type: "table", headers: ["Supplier Type", "Definition", "Takes Title (Owns Inventory)", "Advantages", "Disadvantages"],
        rows: [
          ["Manufacturer/Processor", "Company that makes the product; sells direct in large quantities", "YES", "Lowest price (no middleman markup); technical product expertise; direct relationship", "High minimum orders; limited product range; requires large storage; less flexible"],
          ["Wholesaler/Distributor", "Buys products from manufacturers and resells to foodservice operations; TAKES POSSESSION of goods", "YES — takes title to goods", "One-stop shopping for many products; smaller order quantities; delivery to your door; credit terms", "Higher price than direct manufacturer (markup for service); less control over product selection"],
          ["Broker", "Represents manufacturers but does NOT take possession of goods; earns commission from manufacturer", "NO — never takes title; acts as agent", "Industry expertise; can negotiate better manufacturer prices; no additional markup to buyer", "Limited to brands they represent; may not prioritize your account; commission creates potential conflict of interest"],
          ["Manufacturer's Representative", "Independent salesperson who sells specific manufacturer's products on commission; does not take title", "NO", "Product expertise for specific lines; builds long-term relationships", "Limited to one or few manufacturers; less flexible than broker"],
          ["GPO (Group Purchasing Organization)", "Organization that negotiates contracts on behalf of member facilities; collective buying power", "N/A — negotiates contracts, does not sell directly", "Significant volume discounts; access to pre-negotiated contracts; saves bidding time", "Must commit to minimum purchase volumes; may not offer best local product; standardizes product selection"],
        ]},
      { type: "trap", text: "BROKER vs WHOLESALER distinction is heavily tested: A broker represents the manufacturer and NEVER takes title to goods (does not own inventory). A wholesaler BUYS and OWNS the inventory before reselling. Brokers earn commission; wholesalers earn markup on resale." },
      { type: "subtitle", text: "2.3 Purchasing Methods" },
      { type: "table", headers: ["Method", "Description", "When Used", "Advantages", "Disadvantages"],
        rows: [
          ["Formal competitive bidding (sealed bid)", "Written specifications sent to multiple suppliers; sealed bids submitted by deadline; lowest qualified bid wins", "Large purchases above threshold; publicly funded institutions (hospitals, schools); required by law in many cases", "Most competitive pricing; transparent; fair to all suppliers; legally defensible", "Time-consuming; rigid specifications required; may discourage small suppliers; lowest price not always best value"],
          ["Informal (negotiated) purchasing", "Verbal or written quotes obtained from limited suppliers; negotiated terms", "Small purchases below formal bid threshold; time-sensitive needs; specialized products with few suppliers", "Fast; flexible; allows relationship-based purchasing; good for specialty items", "Less competitive; potential for favoritism; less transparent; harder to audit"],
          ["Prime vendor agreement", "Exclusive or preferred supplier agreement for most purchases; volume commitment in exchange for price discounts and service guarantees", "High-volume operations; when consistency and service are priorities", "Guaranteed pricing; preferred service; administrative simplicity; rebates; one invoice", "Reduced price competition; locked in to one supplier; minimum volume commitments; less flexibility"],
          ["Standing order", "Automatic regular delivery (daily, weekly) of specified quantities without individual purchase orders", "Perishable items (dairy, bread, produce) with predictable daily needs", "Reduces ordering labor; ensures consistent supply; simplifies receiving", "Risk of over-ordering; must monitor carefully; not suitable for fluctuating demand items"],
          ["Stockless purchasing", "Products delivered directly to point of use rather than central storeroom; distributor manages inventory", "Facilities with limited storage space; when distributor is reliable; reduces inventory investment", "Minimal storage; frees capital; reduces shrinkage; fresh products", "Higher unit price; dependent on supplier reliability; requires frequent deliveries; supply disruption risk"],
        ]},
      { type: "subtitle", text: "2.4 Receiving Procedures — 5 Steps" },
      { type: "table", headers: ["Step", "Action", "Key Quality Checks"],
        rows: [
          ["1. Compare purchase order to invoice", "Verify items received match what was ordered: correct products, quantities, and prices", "Check PO number; item codes; prices match quoted prices; quantity matches order"],
          ["2. Inspect products", "Verify quality meets specifications; check temperatures; examine packaging integrity", "Temperature: fresh meat <41 degrees F, frozen <0 degrees F; no broken seals; expiration dates; signs of damage or infestation; correct grade/brand"],
          ["3. Accept or reject delivery", "Accept items meeting specs; reject and document items not meeting specs; never accept substitutions without manager approval", "Document all rejections; photograph defects; return with driver; credit memo for rejected items"],
          ["4. Complete receiving records", "Record all accepted items in receiving log; note any exceptions or credits", "Date, supplier, items, quantities, prices, condition; signature of receiver; update inventory records"],
          ["5. Store immediately", "Move items to appropriate storage immediately after receiving; apply FIFO rotation", "Temperature-controlled items first (dairy, meat, produce); dry goods second; rotate stock; date all items"],
        ]},
      { type: "subtitle", text: "Receiving Methods" },
      { type: "bullet", items: ["Standard/Invoice receiving: Compare delivered items against invoice while driver waits; most common method", "Blind receiving: Receiver counts and records quantities WITHOUT seeing prices or quantities on invoice; then compares to invoice; most ACCURATE but most TIME-CONSUMING and EXPENSIVE; prevents collusion between receiver and driver", "Tag method: Hang tags on all meat items received; tag includes supplier, weight, price, date; used for high-value proteins"] },
      { type: "subtitle", text: "2.5 FOB (Free on Board) Terms" },
      { type: "table", headers: ["Term", "Title Transfer Point", "Who Bears Risk in Transit", "Who Pays Freight", "Implication"],
        rows: [
          ["FOB Origin (Shipping Point)", "Title transfers when goods LEAVE the supplier's facility", "BUYER — buyer owns goods during transport", "BUYER pays freight", "If shipment is lost or damaged in transit, buyer bears the loss; buyer must file insurance claim"],
          ["FOB Destination", "Title transfers when goods ARRIVE at buyer's receiving dock", "SELLER — seller owns goods during transport", "SELLER pays freight (included in price)", "If shipment is lost or damaged, seller bears the loss; simpler for buyer; most common in healthcare purchasing"],
        ]},
    ]
  },
  {
    title: "SECTION 3: INVENTORY MANAGEMENT",
    color: "#7B3F9E",
    content: [
      { type: "subtitle", text: "3.1 Inventory Control Methods" },
      { type: "table", headers: ["Method", "Description", "Advantages", "Disadvantages", "Best For"],
        rows: [
          ["Perpetual Inventory", "Running balance maintained continuously; every item in and out recorded in real-time; balance always known without physical count", "Always know current stock level; early theft detection; accurate reorder points; reduce stockouts", "Labor-intensive; requires technology or dedicated staff; errors accumulate if not corrected", "High-value items (meats, spirits, expensive proteins); items prone to pilfering; A items in ABC classification"],
          ["Physical Inventory", "Actual physical count of all items at regular intervals (minimum monthly in most foodservice operations)", "Most accurate at count time; verifies perpetual inventory; required for financial statements", "Labor-intensive at count time; snapshot only (not real-time); requires operation slowdown during count", "Monthly reconciliation; year-end financial statements; verifying perpetual inventory accuracy"],
          ["Combination", "Perpetual inventory for high-value (A) items; periodic physical count for B and C items", "Best of both systems; focuses controls where most valuable", "More complex to manage; requires clear item classification", "Most large foodservice operations"],
        ]},
      { type: "subtitle", text: "3.2 Inventory Valuation Methods" },
      { type: "table", headers: ["Method", "How Price is Assigned", "Effect on Cost of Goods Sold", "Effect on Ending Inventory Value", "Best Used When"],
        rows: [
          ["FIFO (First In, First Out)", "Cost of OLDEST inventory used first; newer purchases remain in inventory", "Lower COGS in periods of rising prices (old, cheaper inventory used first)", "Higher ending inventory value (recent, higher-priced items in stock)", "Most common in perishable food; matches physical rotation; lower COGS = higher profit = higher taxes in inflationary period"],
          ["LIFO (Last In, First Out)", "Cost of NEWEST inventory used first; older purchases remain in inventory", "Higher COGS in periods of rising prices (newer, higher-cost inventory used first)", "Lower ending inventory value (old, cheaper items remain)", "Not recommended for food (does not match physical rotation); some tax advantages; rarely used in foodservice"],
          ["Weighted Average (WA)", "Average cost calculated by weighting price by quantity purchased; all units valued at same average price", "Moderate COGS; smooths out price fluctuations", "Moderate ending inventory value", "Best when prices fluctuate frequently; provides stable, smoothed cost data; reduces impact of price spikes"],
          ["Actual Purchase Price", "Each unit valued at its specific actual purchase price; most precise", "Exact COGS for each specific unit used", "Exact value of remaining specific units", "Practical only for small operations or high-value unique items where specific identification is feasible"],
        ]},
      { type: "trap", text: "Weighted Average method calculates price based on BOTH unit price AND number of units in each purchase — not just a simple average of prices. This is a frequent exam question about the definition of weighted average." },
      { type: "subtitle", text: "3.3 ABC Inventory Classification" },
      { type: "table", headers: ["Class", "% of Total Items", "% of Total Inventory Value", "Control Level", "Ordering Approach"],
        rows: [
          ["A Items", "10-20% of items", "60-80% of total value", "TIGHT control; perpetual inventory; frequent counts; careful specification; competitive bidding", "Small, frequent orders; narrow safety stock; careful monitoring of usage"],
          ["B Items", "20-30% of items", "15-25% of total value", "MODERATE control; periodic physical count; regular review", "Moderate order quantities; moderate safety stock"],
          ["C Items", "50-60% of items", "5-10% of total value", "MINIMAL control; large batch orders; infrequent ordering; simple physical count", "Large, infrequent orders; high safety stock to avoid stockouts; low administrative cost"],
        ]},
      { type: "key", text: "ABC classification: A = few items, most value, most control. C = most items, least value, least control. Focus management time and systems on the A items." },
      { type: "subtitle", text: "3.4 Key Inventory Formulas" },
      { type: "table", headers: ["Formula", "Equation", "Normal Range/Target", "Example"],
        rows: [
          ["Monthly food cost", "Opening inventory + Purchases - Closing inventory", "Compare to budget", "Opening $15,000 + Purchases $28,000 - Closing $13,000 = $30,000 food cost"],
          ["Inventory turnover rate", "Food cost for period / Average inventory value", "2-3 times per month = optimal; less than 2 = too much inventory; more than 3 = stockout risk", "Monthly food cost $30,000 / [(Opening $15,000 + Closing $13,000)/2] = $30,000/$14,000 = 2.14 turns"],
          ["Reorder point", "Safety stock + (Average daily usage x Lead time in days)", "Triggers purchase order before stockout occurs", "Safety stock 50 units, use 20/day, 3-day lead time: 50 + (20x3) = 110 units — reorder when stock hits 110"],
          ["Economic Order Quantity (EOQ)", "Square root of [(2 x Annual demand x Ordering cost per order) / Annual holding cost per unit]", "Minimizes total cost (ordering cost + holding/carrying cost)", "Annual demand 1,200 units, order cost $50, holding cost $2/unit: SQRT[(2x1200x50)/2] = SQRT[60,000] = 245 units"],
          ["As-Purchased to Edible Portion", "EP weight = AP weight x Yield %; AP weight needed = EP weight needed / Yield %", "Each item has a specific yield % based on trimming, cooking loss, waste", "Need 5 lb cooked chicken (EP); raw chicken yield 65%: 5/0.65 = 7.7 lb AP needed"],
          ["Yield %", "(EP weight / AP weight) x 100", "Varies by item; trim loss + cooking loss + moisture loss", "10 lb AP beef roast cooked to 6.5 lb: 6.5/10 x 100 = 65% yield"],
        ]},
    ]
  },
  {
    title: "SECTION 4: FOODSERVICE PRODUCTION SYSTEMS",
    color: "#7B3F9E",
    content: [
      { type: "subtitle", text: "4.1 The Four Production Systems — Complete Comparison" },
      { type: "table", headers: ["Feature", "Conventional (Cook-Serve)", "Ready-Prepared (Cook-Chill/Freeze)", "Commissary (Central Kitchen)", "Assembly-Serve (Convenience)"],
        rows: [
          ["Definition", "Food produced and served immediately on-site; traditional approach", "Food cooked, chilled or frozen, stored, then reheated (rethermalized) just before service", "Central production kitchen cooks food in bulk; distributes to satellite service sites", "Purchased fully or partially prepared; minimal on-site cooking; heat and serve"],
          ["Production timing", "Production immediately precedes service; just-in-time", "Production is separated from service by hours or days; scheduled independently", "Production in central facility hours before delivery to satellites", "Production occurs off-site (at manufacturer or commissary); on-site only assembly/heating"],
          ["Labor distribution", "UNEVEN peak workload around mealtimes; overtime often needed", "EVEN workload throughout day and week; flexible scheduling; no overtime peaks", "High-volume labor concentrated in central facility; satellites need minimal skilled labor", "MINIMAL labor overall; mostly unskilled assembly and heating"],
          ["Food quality", "HIGHEST potential quality; freshness; hot food hot at service", "Variable; depends on rethermalization quality; some quality loss; not all foods freeze well", "Consistent quality across all satellite locations; central quality control", "Most LIMITED quality and variety; dependent on purchased product quality"],
          ["Menu flexibility", "HIGHEST flexibility; can change daily; chef creativity maximized", "Moderate flexibility; limited by what freezes/chills well", "Limited by what central kitchen produces; uniform menu across satellites", "LOWEST flexibility; limited to available convenience products"],
          ["Equipment investment", "Standard kitchen equipment; distributed across sites", "Requires blast chillers, freezers, rethermalization equipment; EXPENSIVE initial investment", "High investment at central facility; minimal at satellites; overall may be lower per site", "LOWEST equipment investment; minimal cooking equipment needed on-site"],
          ["Energy use", "Higher energy per meal (multiple small batches)", "More energy-efficient; large batch production; off-peak cooking", "Efficient batch production centrally; transportation energy cost added", "LOWEST production energy; mainly heating equipment"],
          ["Food safety risk", "Lower risk with proper temp control; food served quickly after cooking", "Risk during cooling and reheating; strict HACCP required; blast chilling critical", "HIGH food safety risk during transport; temperature control during distribution critical", "Varies by product; purchased products have manufacturer safety protocols"],
          ["Examples/Best Use", "Fine dining; small hospitals; school cafeterias with full kitchen", "Large hospitals; correctional facilities; operations wanting workload balance", "Multi-unit chains; school districts; military feeding; hospital systems with multiple buildings", "Airline catering; small satellite cafeterias; emergency feeding; limited kitchen space"],
          ["Rethermalization equipment", "N/A", "Convection ovens; rethermalization carts; microwave; steam; cook-chill trolleys", "At satellite sites: rethermalization ovens or carts", "Steam table or convection oven for heating; minimal equipment"],
        ]},
      { type: "trap", text: "Exam loves to test which system separates production from service — that is Ready-Prepared (Cook-Chill/Cook-Freeze). Also know that Commissary centralizes production and distributes to satellites. Assembly-Serve does NO significant cooking on-site." },
      { type: "subtitle", text: "4.2 Food Distribution Systems" },
      { type: "table", headers: ["System", "Description", "Advantages", "Disadvantages", "Best For"],
        rows: [
          ["Centralized distribution", "Food is portioned, plated, and assembled in the central kitchen; complete trays delivered to patients/residents", "Food quality control at one point; consistent portioning; no satellite equipment needed; lower satellite labor", "Temperature loss during transport if distances are long; must have efficient delivery system; all eggs in one basket (kitchen problem affects everyone)", "Smaller hospitals; facilities with short distances from kitchen to patient; where consistency is paramount"],
          ["Decentralized distribution", "Food transported in bulk (in heated/chilled carriers) to satellite kitchens or pantries near point of service; portioned and assembled near patient", "Fresher food at service point; closer to patient means shorter wait; accommodates last-minute diet changes; patient interaction possible", "Equipment in multiple locations; higher labor at satellites; quality control more difficult; requires trained satellite staff", "Large hospitals with long distances from kitchen; facilities prioritizing food quality at service; where personalized service matters"],
        ]},
    ]
  },
  {
    title: "SECTION 5: HACCP & FOOD SAFETY",
    color: "#7B3F9E",
    content: [
      { type: "subtitle", text: "5.1 HACCP — Seven Principles" },
      { type: "text", text: "HACCP (Hazard Analysis and Critical Control Points) is a science-based, systematic approach to identifying and controlling food safety hazards. It is PREVENTIVE (proactive) rather than reactive. HACCP is required by FDA and USDA for most food processing and is strongly encouraged (often required) in foodservice." },
      { type: "table", headers: ["Principle", "Action", "Key Questions to Ask", "Example"],
        rows: [
          ["1. Conduct Hazard Analysis", "Identify all potential biological, chemical, and physical hazards at each step of food production from receiving through service", "What could go wrong here? What pathogens could be present? What chemicals could contaminate? What physical objects could enter?", "Receiving raw chicken: biological hazard = Salmonella, Campylobacter; physical hazard = bone fragments"],
          ["2. Identify Critical Control Points (CCPs)", "Determine steps where control IS ESSENTIAL to prevent, eliminate, or reduce food safety hazard to acceptable level; not all hazards require a CCP", "Is this the LAST step where this hazard can be controlled? Can control here prevent the hazard completely?", "Cooking chicken to 165 degrees F = CCP (kills Salmonella); receiving temperature check = CCP for temp-sensitive items"],
          ["3. Establish Critical Limits", "Set the measurable boundary that must be met at each CCP; the line between safe and unsafe", "What measurement indicates this CCP is under control? Must be objective and measurable (not cook until done)", "Chicken internal temperature 165 degrees F or higher; cold receiving temperature 41 degrees F or lower; pH 4.6 or lower for acidified foods"],
          ["4. Establish Monitoring Procedures", "Determine how each CCP will be measured, by whom, how frequently, and with what equipment; monitoring must be continuous or frequent enough to catch deviations", "Who will check? How often? What equipment? How will results be recorded?", "Cook checks chicken temperature with calibrated thermometer at end of cooking; record on temperature log with time, temp, initials"],
          ["5. Establish Corrective Actions", "Predetermined actions to take WHEN a critical limit is NOT met; must address both the affected product and the cause of the deviation", "What do we do with the food? What do we do to fix the process? Who decides?", "Chicken not reaching 165 degrees F: return to oven until temp met; discard if time/temperature abuse occurred; recalibrate thermometer; investigate equipment failure"],
          ["6. Establish Verification Procedures", "Activities other than monitoring that confirm HACCP system is working effectively; confirms monitoring is being done correctly and critical limits are appropriate", "Is the HACCP plan being followed? Are monitoring methods reliable? Is the plan still appropriate?", "Supervisor reviews temperature logs weekly; annual HACCP plan review; periodic product testing; equipment calibration verification"],
          ["7. Establish Record-Keeping", "Document all HACCP activities: hazard analysis, CCP identification, critical limits, monitoring results, corrective actions taken, and verification activities", "What documentation is required? How long must records be kept? Who is responsible?", "Receiving logs; cooking temperature logs; corrective action logs; equipment calibration records; employee training records"],
        ]},
      { type: "key", text: "CCPs are steps where CONTROL IS ESSENTIAL — not all hazards require a CCP. The question to ask: Is this the LAST opportunity to prevent this hazard? Cooking is almost always a CCP for biological hazards in raw proteins." },
      { type: "subtitle", text: "5.2 Temperature Control — Complete Reference" },
      { type: "table", headers: ["Parameter", "Temperature", "Context"],
        rows: [
          ["Temperature Danger Zone", "41 degrees F - 135 degrees F (5 degrees C - 57 degrees C)", "Pathogens multiply rapidly in this range; goal is to minimize time food spends here"],
          ["Maximum time in danger zone", "4 hours CUMULATIVE total", "Clock starts when food enters danger zone; once 4 hours reached, discard — do not recalculate after reheating"],
          ["Cooling: Stage 1", "135 degrees F to 70 degrees F within 2 HOURS", "Most critical stage; rapid bacterial growth possible; use ice baths, shallow pans, blast chiller"],
          ["Cooling: Stage 2", "70 degrees F to 41 degrees F within 4 HOURS (6 hours total from 135 degrees F)", "Continue rapid cooling; refrigerator alone often insufficient for large volumes; portion into shallow containers"],
          ["Reheating for hot holding", "165 degrees F or higher within 2 hours", "Rapid reheating required; steam tables do NOT reheat — only hold; use oven or stovetop then transfer to steam table"],
          ["Hot holding minimum", "Above 135 degrees F (57 degrees C)", "Food must be held ABOVE danger zone; check temperature every 2-4 hours"],
          ["Cold holding maximum", "41 degrees F or lower (5 degrees C)", "Refrigerator temperature; check temperature daily; use refrigerator thermometers"],
          ["Poultry (all forms)", "165 degrees F (74 degrees C) internal", "Ground poultry, whole birds, stuffed poultry, stuffing, casseroles with poultry"],
          ["Ground beef/pork/lamb", "155 degrees F (68 degrees C) for 15 seconds", "Hamburgers, meatloaf, ground meat dishes; pathogens from surface mixed throughout during grinding"],
          ["Whole muscle beef/pork/veal/lamb", "145 degrees F (63 degrees C) + 3 minute rest", "Steaks, roasts, chops; rest allows temperature to equalize and carryover cooking to occur"],
          ["Fish (all types)", "145 degrees F (63 degrees C)", "All finfish; some jurisdictions require 145 degrees F for shellfish too"],
          ["Eggs cooked for hot holding", "155 degrees F (68 degrees C)", "If cooking immediately for service: 145 degrees F; if cooking for hot holding: 155 degrees F"],
          ["Pasteurized eggs/egg products", "145 degrees F (63 degrees C)", "Liquid eggs, pasteurized egg products used in cooking"],
          ["Vegetable dishes", "135 degrees F (57 degrees C)", "Commercially processed ready-to-eat foods; starchy vegetables: 165 degrees F if reheated"],
          ["C. botulinum spores destroyed", "121 degrees C (250 degrees F) at 15 psi for 3 minutes (autoclave/pressure canning)", "ONLY achievable with pressure canning; required for ALL low-acid canned foods (vegetables, meats, fish)"],
        ]},
      { type: "trap", text: "Steam tables, chafing dishes, and heat lamps are for HOLDING hot food — they CANNOT reheat food. Food must be rapidly reheated to 165 degrees F using an oven, stovetop, or microwave BEFORE transferring to hot holding equipment." },
      { type: "trap", text: "Cooling: 2+4 rule. Stage 1: 135 to 70 degrees F in 2 hours. Stage 2: 70 to 41 degrees F in 4 hours. TOTAL: 6 hours from 135 degrees F to 41 degrees F. If either stage exceeds its time limit, discard the food." },
      { type: "subtitle", text: "5.3 Major Foodborne Pathogens — Key Facts" },
      { type: "table", headers: ["Pathogen", "Type", "High-Risk Foods", "Onset", "Key Characteristics", "Prevention"],
        rows: [
          ["Salmonella spp.", "Bacteria", "Poultry, eggs, produce, dairy", "6-48 hours", "Most common cause of foodborne illness in US; destroyed by cooking to 165 degrees F; can survive on surfaces", "Cook poultry to 165 degrees F; separate raw from ready-to-eat; handwashing; refrigerate promptly"],
          ["Clostridium perfringens", "Bacteria (spore-forming)", "Cooked meat and poultry held at wrong temperatures; stews, gravies", "8-16 hours (self-limiting)", "Grows rapidly in cooked meat held at 70-125 degrees F; spores survive cooking; toxin produced in gut; mass feeding events are high risk", "Cool rapidly; hold hot above 135 degrees F; reheat to 165 degrees F; serve within 2 hours"],
          ["Staphylococcus aureus", "Bacteria (toxin-mediated)", "High-protein foods (potato salad, cream puffs, custards, sliced deli meats) handled by infected food worker", "1-6 hours (rapid onset)", "Toxin is heat-STABLE (survives cooking even if bacteria are killed); source is usually infected food handler (skin, hair, nose); grows at room temp", "Exclude sick workers; strict handwashing; temperature control; do not contaminate ready-to-eat foods"],
          ["Clostridium botulinum", "Bacteria (spore-forming)", "Improperly canned low-acid foods; garlic in oil; honey (infant botulism)", "12-72 hours (neurological)", "Produces most potent biological toxin known; anaerobic (grows without oxygen); spores only killed at 250 degrees F pressure canning; toxin destroyed by boiling 10 minutes", "Pressure canning for low-acid foods; never give honey to infants under 1 year; refrigerate garlic-in-oil; commercial canning only"],
          ["E. coli O157:H7 (STEC)", "Bacteria", "Undercooked ground beef; unpasteurized juice/cider; raw produce (sprouts, leafy greens); contaminated water", "1-10 days", "Produces Shiga toxin; very low infectious dose (as few as 10 cells); hemolytic uremic syndrome (HUS) in severe cases causes renal failure; children and elderly most at risk", "Cook ground beef to 155 degrees F; pasteurized products; handwashing; avoid raw sprouts for vulnerable populations"],
          ["Listeria monocytogenes", "Bacteria", "Unpasteurized dairy, soft cheeses, deli meats, hot dogs, smoked fish, prepared salads", "3-70 days (long incubation)", "Grows at REFRIGERATOR temperatures (4 degrees C/39 degrees F) — unique; pregnant women, elderly, immunocompromised most at risk; can cause miscarriage", "Refrigerate promptly but do not assume refrigeration prevents Listeria; avoid high-risk foods during pregnancy; clean deli slicers"],
          ["Norovirus", "Virus", "Shellfish (oysters), ready-to-eat foods handled by infected person, water", "12-48 hours", "Leading cause of foodborne illness outbreaks; HIGHLY contagious (very low infectious dose); vomiting is hallmark symptom; survives many disinfectants; transmitted by infected food handlers", "Exclude ill workers for 48-72 hours AFTER symptoms resolve; strict handwashing; cook shellfish thoroughly; chlorine sanitation (high concentration)"],
          ["Hepatitis A", "Virus", "Raw shellfish, ready-to-eat foods contaminated by infected handler", "15-50 days (long)", "Long incubation makes source difficult to identify; vaccination available and recommended for food workers; very stable virus", "Food worker vaccination; strict handwashing; exclude ill workers; cook shellfish; avoid raw shellfish"],
          ["Campylobacter jejuni", "Bacteria", "Raw poultry, unpasteurized milk/juice, contaminated water", "1-10 days", "Leading cause of foodborne diarrheal illness globally; sensitive to heat (killed at 165 degrees F); associated with Guillain-Barre syndrome in some cases", "Cook poultry to 165 degrees F; pasteurized dairy; handwashing; prevent cross-contamination"],
        ]},
      { type: "trap", text: "Listeria is unique because it GROWS at refrigerator temperatures — most pathogens are inhibited by refrigeration. This is why vulnerable populations (pregnant women, immunocompromised, elderly) must avoid high-risk deli meats and soft cheeses even when properly refrigerated." },
      { type: "trap", text: "Staph aureus toxin is HEAT-STABLE — if contaminated food is heated, you kill the bacteria but the toxin REMAINS active. Unlike most pathogens, cooking contaminated food does NOT make it safe once Staph toxin has been produced." },
    ]
  },
  {
    title: "SECTION 6: SANITATION & PERSONAL HYGIENE",
    color: "#7B3F9E",
    content: [
      { type: "subtitle", text: "6.1 Sanitizers — Detailed Comparison" },
      { type: "table", headers: ["Property", "Chlorine (Hypochlorite)", "Quaternary Ammonium (Quats)", "Iodine/Iodophors"],
        rows: [
          ["Active agent", "Hypochlorous acid (HOCl) — active killing form; most effective at slightly acidic pH 6-7", "Quaternary ammonium cations; cationic surfactants", "Free iodine (I2) complexed with carrier to slow release"],
          ["Effective concentration", "50-200 ppm for food contact surfaces; 100 ppm most common", "200-400 ppm; varies by formulation", "12.5-25 ppm for food contact surfaces"],
          ["Temperature range", "Effective at lower temperatures; hotter water DESTROYS chlorine; use tepid water", "Effective across wide temperature range; stable at high temp", "Loses effectiveness above 120 degrees F (49 degrees C); evaporates at high temp"],
          ["pH range", "Most active at acidic pH (6-7); significantly less effective at alkaline pH above 8", "Effective across wide pH range (pH 3-10); more stable than chlorine re pH", "Most effective at acidic-neutral pH; inactive at basic pH above 5"],
          ["Effectiveness against spores", "YES — effective against bacterial spores", "NO — not effective against spores", "Some effectiveness against protozoan cysts (Cryptosporidium)"],
          ["Hard water tolerance", "Somewhat reduced effectiveness in very hard water", "Reduced effectiveness in hard water (Ca/Mg ions interfere)", "Less affected by hard water than chlorine"],
          ["Organic matter effect", "SIGNIFICANTLY inactivated by organic matter (food soil, blood, grease)", "Less affected by organic matter than chlorine", "Moderately affected by organic matter"],
          ["Corrosion risk", "CORROSIVE to metals (especially stainless steel at high concentrations), rubber, skin", "Non-corrosive; skin-friendly; residual antimicrobial action", "Stains plastic, linens, and surfaces (brown/yellow)"],
          ["Detection method", "Test strips (yellow/colorless indicates depletion)", "Test strips", "Visual — amber color indicates active concentration; colorless = depleted"],
          ["Mixing hazard", "Never mix with ammonia (produces chloramine gas) or acids", "NEVER mix with detergents/soaps (produces toxic residues; renders quats ineffective)", "Generally compatible; slight iodine off-flavor risk"],
          ["Residual activity", "Low residual effect; evaporates and breaks down quickly", "HIGH residual activity — leaves antimicrobial film on surfaces", "Moderate residual activity"],
          ["Common applications", "General food contact surface sanitizing; produce washing; dishwashing final rinse (high-temp machines)", "Sanitizing food contact surfaces in bars, restaurants; floor mopping; hand sanitizing", "Bar sanitizing; food contact surface sanitizing; color indicates effectiveness"],
        ]},
      { type: "trap", text: "QUATS + DETERGENTS = NEVER. Mixing quaternary ammonium sanitizers with soap or detergent residue neutralizes the sanitizer AND can produce harmful compounds. Always thoroughly rinse surfaces with water BEFORE applying quats." },
      { type: "trap", text: "Chlorine concentration matters: too low = ineffective; too high = corrosive and leaves chemical residue on food contact surfaces. Always use test strips to verify concentration is in approved range." },
      { type: "subtitle", text: "6.2 Warewashing — Manual and Mechanical" },
      { type: "table", headers: ["Parameter", "Manual 3-Compartment Sink", "Mechanical High-Temperature", "Mechanical Chemical (Low-Temp)"],
        rows: [
          ["Process", "Wash (110-120 degrees F with detergent) then Rinse (clean water) then Sanitize (immerse per sanitizer instructions)", "Wash cycle then rinse then final hot water rinse 180 degrees F (or 160 degrees F at dish surface)", "Wash cycle then rinse then final chemical sanitizer rinse (chlorine, quats, or iodine)"],
          ["Sanitization method", "Chemical sanitizer: chlorine, quats, or iodine at correct concentration and contact time", "HEAT sanitization: 180 degrees F final rinse kills pathogens by thermal destruction", "Chemical sanitizer at lower temperature; chemical does the sanitizing work"],
          ["Water temperature — wash", "110-120 degrees F to dissolve grease; too hot = sanitizer depletes faster", "Higher wash temperature; machine controlled", "Machine controlled"],
          ["Final rinse temp", "Sanitizer temperature per product label", "180 degrees F or higher at manifold; 160 degrees F or higher at dish surface", "Ambient temperature; chemical does sanitizing"],
          ["Advantages", "Flexible; no mechanical failure; good for large pots/pans; low capital cost", "No chemical handling; effective against heat-resistant pathogens; no chemical residue risk", "Lower energy cost than high-temp; no booster heater needed"],
          ["Disadvantages", "Labor-intensive; human error in concentration; proper immersion time critical", "High energy cost (booster heater to reach 180 degrees F); heat damage to some items; not effective if thermometer fails", "Chemical handling; concentration must be verified; some pathogens more resistant to chemical sanitizers"],
        ]},
      { type: "subtitle", text: "6.3 Personal Hygiene Requirements" },
      { type: "bullet", items: ["Handwashing: minimum 20 seconds with soap and warm water; required before food handling, after restroom, after touching face/hair/body, after handling raw protein, after taking out trash, after using phone", "Hand sanitizer does NOT replace handwashing — it is a supplement only; not effective against Norovirus or C. diff spores", "Exclusion criteria (must be excluded from work): vomiting, diarrhea, jaundice (yellow skin/eyes), diagnosed Salmonella typhi, Shigella, STEC O157:H7, Hepatitis A, Norovirus", "Restriction (not excluded but restricted from working with exposed food): sore throat with fever, infected wound on hand (must cover with waterproof bandage and single-use glove)", "Hair restraints: required for all food handlers; covers all hair; hats, hair nets, or beard guards", "Glove use: single-use gloves for ready-to-eat foods; change gloves frequently; gloves do NOT replace handwashing", "Jewelry: no rings (except plain band), bracelets, dangling earrings, nail polish, or artificial nails while handling food"] },
    ]
  },
  {
    title: "SECTION 7: EQUIPMENT & FACILITY DESIGN",
    color: "#7B3F9E",
    content: [
      { type: "subtitle", text: "7.1 Oven Types — Complete Comparison" },
      { type: "table", headers: ["Oven Type", "How It Works", "Advantages", "Disadvantages", "Best For"],
        rows: [
          ["Standard/Conventional", "Heating elements or gas burners at top and bottom; relies on natural convection; hot air rises, cool air sinks", "Simple; inexpensive; good for delicate items; consistent bottom-up heat", "Uneven heat distribution; hot spots; slow; requires rotation of pans; inconsistent results", "Gentle baking (souffles, custards); items that cannot be disturbed by air movement"],
          ["Convection", "Fan circulates heated air throughout oven cavity; continuous air movement around food", "Even heat distribution; 25-30% faster than conventional; better browning and crisping; more energy efficient", "Air movement can dry out some products; may not be suitable for very delicate items; batter items may blow sideways", "Most baking, roasting, and cooking applications; most versatile; most common in commercial foodservice"],
          ["Steam (Steamer/Convection Steamer)", "Injects steam into cooking cavity; food cooked by contact with steam (100 degrees C / 212 degrees F max at sea level) or pressurized steam (above 100 degrees C)", "Fast and even cooking; excellent color and nutrient retention; no browning; less shrinkage", "Cannot brown or crisp food (no Maillard reaction); limited to moist foods; requires water supply", "Vegetables, fish, rice, potatoes, eggs; any food where moisture retention is priority"],
          ["Combination (Combi) Oven", "Switches between convection (dry), steam (moist), and combination (convection + steam) modes; most versatile single unit", "Maximum versatility; cook with precision moisture and heat control; consistent results; can sous vide, poach, bake, roast, steam", "Most expensive purchase and maintenance; complex operation; requires training; water and drain connection", "High-volume sophisticated operations; when one oven needs to do everything; healthcare where customized cooking needed"],
          ["Microwave", "Electromagnetic waves cause water molecules in food to vibrate rapidly, generating heat from inside out", "Extremely fast heating; energy efficient; minimal preheating; good for reheating individual portions", "Does not brown; uneven heating in dense foods; limited capacity; not suitable for large volume production", "Reheating individual portions; tempering frozen foods; quick heating; supplemental in healthcare for patient meals"],
          ["Deck/Range Oven", "Multiple chambers stacked vertically; stone or steel deck surface conducts heat directly to food bottom", "Excellent bottom crust from direct conduction heat; consistent baking; good for high-volume pizza and bread", "Long preheat time; heavy; requires skilled operator; less versatile than convection", "Pizza, hearth breads, artisan baking; operations where bottom crust quality is paramount"],
          ["Conveyor/Impingement", "Food moves through on a conveyor belt; high-velocity jets of hot air impinge directly on food surface", "Very fast; consistent results without operator attention; ideal for high-volume assembly-line production", "Less versatile; limited to items that fit through conveyor opening; noisy; expensive", "Pizza chains; high-volume sandwich shops; any high-throughput standardized product"],
          ["Rotisserie", "Slow rotating spit over radiant heat source; continuous rotation ensures even self-basting cooking", "Self-basting produces moist interior with crisp exterior; dramatic display effect; hands-off operation", "Limited to spit-appropriate proteins; longer cooking times; cleaning challenges", "Whole chickens, roasts, large cuts; operations where display cooking adds sales appeal"],
        ]},
      { type: "trap", text: "Convection ovens use a FAN to circulate air — this is why they cook faster and more evenly. Steam ovens cannot BROWN food (Maillard reaction requires dry heat). Combination ovens do BOTH. These distinctions appear on the exam." },
      { type: "subtitle", text: "7.2 Stainless Steel Grades" },
      { type: "table", headers: ["Grade", "Composition", "Properties", "Gauge Thickness", "Applications"],
        rows: [
          ["Type 304 (18/8)", "18% chromium + 8% nickel; austenitic stainless steel", "Excellent corrosion resistance; non-magnetic; bright finish; most hygienic; high chromium-nickel content resists oxidation", "18 gauge = light duty (salad prep, light assembly); 16 gauge = general use (standard work tables); 14 gauge = heavy duty (butcher blocks, heavy equipment stands)", "All food contact surfaces; sinks; work tables; equipment bodies; NSF preferred grade for food contact"],
          ["Type 430 (17/0)", "17% chromium; ferritic stainless steel; NO nickel", "Less corrosion resistant than 304; slightly magnetic; less expensive; adequate for non-food-contact surfaces", "Similar gauge range", "Equipment bodies (non-food-contact); equipment legs; shelving; decorative trim; refrigerator interiors"],
          ["Type 316", "18% chromium + 10% nickel + 2-3% molybdenum; austenitic", "Superior corrosion resistance; excellent in chloride environments; most expensive stainless", "N/A for typical foodservice", "Marine environments; highly acidic food processing; pharmaceutical equipment"],
        ]},
      { type: "key", text: "Type 304 = food contact surfaces; Type 430 = non-food-contact (less expensive, slightly magnetic). Gauge: LOWER number = THICKER metal. 14 gauge is THICKER than 18 gauge." },
      { type: "subtitle", text: "7.3 Flooring Materials" },
      { type: "table", headers: ["Material", "Properties", "Advantages", "Disadvantages", "Best For"],
        rows: [
          ["Quarry tile", "Unglazed ceramic tile; dense; porous enough to be slip-resistant when dry; industry standard for commercial kitchens", "SLIP-RESISTANT; durable; heat and chemical resistant; easy to clean; industry standard; health department approved", "Grout lines harbor bacteria; grout must be sealed annually; hard on feet (standing fatigue); cold; slippery when wet if worn", "Production areas; dish rooms; walk-in coolers; anywhere slip resistance and durability required"],
          ["Epoxy (resinous)", "Two-part epoxy compound applied over concrete substrate; seamless surface", "SEAMLESS (no grout lines to harbor bacteria); chemical resistant; can be made slip-resistant with additives; strong", "Requires concrete substrate in good condition; expensive to install; can delaminate if installed over wet concrete; requires expertise to install correctly", "Areas requiring seamless surface (poultry processing, wet areas); facilities prioritizing sanitation"],
          ["Vinyl/PVC composite", "Resilient flooring; softer than tile; various compositions", "Comfortable underfoot; easy to install; water-resistant; antimicrobial options available; cost-effective", "Not as durable as tile or epoxy under heavy equipment; can be damaged by harsh chemicals; seams can harbor bacteria", "Office areas; dry storage; break rooms; light-duty food prep areas"],
        ]},
      { type: "subtitle", text: "7.4 Lighting Requirements" },
      { type: "table", headers: ["Area", "Required Footcandles (fc)", "Rationale"],
        rows: [
          ["Dry storage areas", "10 fc minimum", "Lower activity; less visual precision required; energy conservation"],
          ["Walk-in refrigerators and freezers", "10 fc minimum", "Adequate for inventory inspection and item retrieval"],
          ["Cleaning areas (janitor closets, mop sinks)", "10 fc minimum", "Lower visual precision required"],
          ["Self-service areas (salad bars, serving lines)", "20 fc minimum", "Customers need adequate light to see and select food items safely"],
          ["Hand washing areas", "20 fc minimum", "Adequate visibility to ensure thorough handwashing technique"],
          ["Dishwashing areas", "20 fc minimum", "Need adequate light to verify dishes are clean; not highest precision work"],
          ["Food preparation areas (general)", "50 fc minimum", "Moderate to high precision work; inspecting food quality"],
          ["Food prep areas with cutting tools", "50+ fc minimum (some codes require higher)", "HIGH precision required; cutting injuries increase with poor lighting; must clearly see food and blade"],
          ["Receiving areas", "50 fc minimum", "Must inspect product quality, label information, temperature indicators under adequate light"],
        ]},
      { type: "key", text: "Lighting rule: 10 fc for storage and cleaning, 20 fc for service and washing, 50+ fc for food preparation and receiving. The exam may give a scenario and ask if lighting is adequate or which area requires 50 fc." },
      { type: "subtitle", text: "7.5 Fire Safety — Fire Extinguisher Classes" },
      { type: "table", headers: ["Class", "Fuel Type", "Extinguishing Agent", "Foodservice Application"],
        rows: [
          ["Class A", "Ordinary combustibles: wood, paper, cloth, trash, plastics", "Water, foam, dry chemical (ABC), halon", "Cardboard storage; paper products; wooden furniture; office fires"],
          ["Class B", "Flammable liquids and gases: gasoline, grease fires (NOT cooking oils), paints, solvents", "CO2, dry chemical (ABC or BC), foam, halon", "Fuel storage; solvent areas; vehicle fires; NOT for cooking oil fires"],
          ["Class C", "Electrical fires: energized electrical equipment", "CO2, dry chemical (non-conductive agents); NEVER water", "Electrical panels; motors; wiring; must use non-conductive agent"],
          ["Class D", "Combustible metals: magnesium, titanium, potassium, sodium", "Dry powder (special formulation); NEVER water", "Rare in foodservice; metal shop environments; some chemical laboratories"],
          ["Class K", "COOKING OILS and FATS: animal fats, vegetable oils at high temperatures in cooking equipment", "WET CHEMICAL agent ONLY (saponifies and cools the oil); NEVER water (causes explosive steam/oil spray)", "COMMERCIAL KITCHEN STANDARD; required for cooking equipment (fryers, ranges, griddles); must be mounted near fryers and ranges"],
        ]},
      { type: "trap", text: "Class K extinguisher is MANDATORY for commercial kitchen cooking equipment. NEVER use water on a cooking oil fire — water turns instantly to steam and causes an explosive oil spray that spreads the fire dramatically. Class K wet chemical agent saponifies (turns oil to soap) and cools it." },
    ]
  },
  {
    title: "SECTION 8: SUSTAINABILITY IN FOODSERVICE",
    color: "#7B3F9E",
    content: [
      { type: "table", headers: ["Sustainability Area", "Key Strategies", "Metrics/Standards", "RDN Application"],
        rows: [
          ["Energy conservation", "Energy Star equipment; LED lighting; occupancy sensors; regular equipment maintenance; high-efficiency HVAC; off-peak production; heat recovery systems", "Energy Star certification; BTU per meal produced; kWh per meal", "Food PREPARATION equipment is highest energy consumer in commercial kitchen; refrigeration second; specify Energy Star when purchasing"],
          ["Water conservation", "Low-flow pre-rinse spray valves (must be 1.6 gal/min or less per NSF standard); water-efficient dishwashers; ice machine water conservation; leak detection programs; water recycling where feasible", "Gallons per meal; water audit; EPA WaterSense certification", "Pre-rinse spray valve flow rate is a common exam point; low-flow valves required by many codes"],
          ["Waste reduction (3Rs)", "Reduce (buy only what needed; better forecasting); Reuse (reusable serviceware vs disposables); Recycle (cardboard, glass, cans, plastic, cooking oil for biodiesel)", "% waste diverted from landfill; waste audit data; food waste tracking", "Cardboard is most commonly recycled material in foodservice operations; used cooking oil collected for biodiesel"],
          ["Food waste reduction", "Improved forecasting; smaller batch cooking; FIFO rotation; composting; food donation programs (Good Samaritan Act protects donors); smaller portions on request; menu simplification", "Pounds of food waste per meal served; plate waste audits", "Plate waste studies identify which menu items are consistently wasted; used to modify menu or portion sizes"],
          ["Sustainable purchasing", "Local and seasonal sourcing; certified sustainable seafood (MSC); organic certification; fair trade; reduced packaging; USDA Certified Organic", "Food miles; percentage local; supplier certifications", "Farm-to-table sourcing; hospital farms; school garden programs; local dairy and produce"],
          ["Green building", "LEED certification; natural lighting; efficient HVAC; low-VOC materials; solar panels; green roofs", "LEED points/certification level; energy use intensity (EUI)", "New construction and major renovations; capital planning consideration"],
          ["Carbon footprint reduction", "Plant-forward menus (animal products have significantly higher carbon footprint than plant foods); reduce beef specifically (highest GHG emissions); local sourcing reduces transport emissions", "kg CO2 equivalent per meal; lifecycle analysis", "Shifting meals toward plant-based options is single most impactful dietary change for environmental sustainability"],
        ]},
    ]
  },
  {
    title: "DOMAIN IV QUICK REFERENCE — MOST TESTED FACTS",
    color: "#7B3F9E",
    content: [
      { type: "table", headers: ["Topic", "Critical Fact", "Why It Matters"],
        rows: [
          ["Menu Engineering — Star", "High popularity + High contribution margin; KEEP and protect", "Most valuable menu item; do not change price unnecessarily"],
          ["Menu Engineering — Plow Horse", "High popularity + LOW margin; raise price or reduce cost", "Sells well but not profitable; needs financial adjustment"],
          ["Menu Engineering — Puzzle", "LOW popularity + High margin; reposition and promote", "Makes money when ordered but overlooked; marketing problem"],
          ["Menu Engineering — Dog", "LOW popularity + LOW margin; eliminate", "Neither sells well nor makes money; remove from menu"],
          ["Contribution margin formula", "Selling price - Food (variable) cost per item", "NOT food cost %; margin is the dollar amount each sale contributes to fixed costs and profit"],
          ["Production system — separated from service", "Ready-Prepared (Cook-Chill/Cook-Freeze)", "Production and service are separated in time; rethermalization required"],
          ["Commissary system", "Central kitchen produces; distributes in bulk to satellite sites", "Uniform product; reduced equipment duplication; food safety risk in transport"],
          ["Assembly-Serve", "No significant on-site cooking; purchased pre-prepared items", "Lowest labor and equipment; highest food cost; most limited menu"],
          ["Broker vs Wholesaler", "Broker = NO inventory (agent); Wholesaler = OWNS inventory (buys and resells)", "Most common procurement exam trap; broker earns commission, never takes title"],
          ["FOB Origin", "Title transfers at supplier; buyer owns goods in transit; buyer pays freight and bears loss risk", "If shipment damaged in transit with FOB Origin, buyer files insurance claim"],
          ["FOB Destination", "Title transfers at buyer dock; seller owns goods in transit; seller pays freight", "Most buyer-friendly; seller bears transit risk; most common in healthcare"],
          ["Blind receiving", "Receiver counts without seeing invoice quantities; most accurate but most expensive", "Prevents collusion between receiver and driver; reveals any shorts or overages"],
          ["FIFO rotation", "First In, First Out; oldest items used first", "Standard food rotation; prevents spoilage; required practice in foodservice"],
          ["LIFO", "Last In, First Out; NOT recommended for food perishables", "Used for inventory VALUATION (accounting); not physical rotation method"],
          ["Weighted Average valuation", "Considers BOTH unit price AND number of units in each purchase", "Not a simple average of prices; weights by quantity purchased"],
          ["ABC — A items", "10-20% of items = 60-80% of value; tightest control; perpetual inventory", "Focus management resources where most value at risk"],
          ["Inventory turnover normal range", "2-3 times per month", "Too low = excess inventory (cash tied up); too high = stockout risk or pilfering"],
          ["Reorder point formula", "Safety stock + (Average daily use x Lead time in days)", "Place order BEFORE running out; safety stock = buffer for demand fluctuations"],
          ["HACCP Principle 2", "Identify CCPs — steps where control is ESSENTIAL to prevent hazard", "Not every step is a CCP; must be where control prevents the hazard"],
          ["Critical limits must be", "Objective and measurable (temperature, time, pH, Aw)", "Not cook until done — must be verifiable with equipment"],
          ["Cooling — Stage 1", "135 degrees F to 70 degrees F WITHIN 2 hours", "Fastest bacterial growth range; must cool rapidly through this"],
          ["Cooling — Stage 2", "70 degrees F to 41 degrees F within 4 hours (6 hours total)", "Total cooling time from 135 degrees F to 41 degrees F must not exceed 6 hours"],
          ["C. botulinum spores", "Destroyed at 250 degrees F / 121 degrees C at 15 psi — ONLY pressure canning", "Water bath canning (212 degrees F max) INSUFFICIENT for low-acid foods"],
          ["Staph aureus toxin", "HEAT STABLE — survives cooking even after bacteria are killed", "Once toxin produced, food is unsafe even if reheated; prevention not treatment"],
          ["Listeria", "Grows at refrigerator temperatures (4 degrees C / 39 degrees F)", "Unique among foodborne pathogens; refrigeration does NOT prevent Listeria growth"],
          ["Class K fire", "Cooking oils/fats; WET CHEMICAL extinguisher ONLY; NEVER water", "Water on burning oil causes explosive steam; wet chemical saponifies oil"],
          ["Quats + detergents", "NEVER mix — renders sanitizer ineffective AND produces harmful compounds", "Rinse surfaces completely before applying quat sanitizer"],
          ["Chlorine effectiveness", "Decreases at high pH (above 8) and high temperature; organic matter inactivates", "Use test strips; use tepid water; clean before sanitizing"],
          ["Iodine color indicator", "Amber = active; colorless/faded = depleted; replace", "Visual quality check; stains plastic and linens"],
          ["Stainless steel 304 vs 430", "Type 304 (18/8) = food contact surfaces; Type 430 = non-food contact (less corrosion resistant)", "Type 304 has chromium + nickel; Type 430 is slightly magnetic; no nickel"],
          ["Lighting — food prep with knives", "50+ footcandles minimum", "10 fc = storage; 20 fc = service/dishwashing; 50 fc = prep and receiving"],
          ["Highest energy consumer", "Food preparation equipment (ovens, fryers, ranges)", "Refrigeration is second; energy conservation targets prep equipment first"],
          ["Most commonly recycled", "Cardboard", "Largest volume recyclable in foodservice; used cooking oil also collected for biodiesel"],
        ]},
    ]
  }
];

export default function DomainIVPage() {
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1rem" }}>
      <div style={{ marginBottom: 24 }}>
        <a href="/study-guides" style={{ color: "#7B3F9E", textDecoration: "none", fontSize: 14 }}>← Study Guides</a>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
        <div style={{ background: "#7B3F9E", color: "#fff", borderRadius: 10, width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18, flexShrink: 0 }}>D4</div>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>Domain IV — Foodservice Systems</h1>
          <div style={{ color: "#7B3F9E", fontWeight: 600, fontSize: 14 }}>13% of the RDN Exam</div>
        </div>
      </div>
      <p style={{ color: "#666", marginBottom: 32, fontSize: 14 }}>Covers menu development, procurement, inventory management, production systems, HACCP and food safety, sanitation, and equipment and facility design.</p>
      {sections.map((section, si) => (
        <div key={si} style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: section.color, borderBottom: `2px solid ${section.color}`, paddingBottom: 8, marginBottom: 16 }}>{section.title}</h2>
          {section.content.map((block, bi) => {
            if (block.type === "table") return (
              <div key={bi} style={{ overflowX: "auto", marginBottom: 16 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead><tr>{block.headers.map((h, i) => <th key={i} style={{ background: "#1F3864", color: "#fff", padding: "8px 12px", textAlign: "left", fontWeight: 600 }}>{h}</th>)}</tr></thead>
                  <tbody>{block.rows.map((row, ri) => (
                    <tr key={ri} style={{ background: ri % 2 === 0 ? "#F5EEFB" : "#fff" }}>
                      {row.map((cell, ci) => <td key={ci} style={{ padding: "8px 12px", borderBottom: "1px solid #e0e0e0", verticalAlign: "top", fontSize: 13 }}>{cell}</td>)}
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            );
            if (block.type === "trap") return (
              <div key={bi} style={{ background: "#FFF0F0", border: "1px solid #ffcccc", borderLeft: "4px solid #C00000", borderRadius: 8, padding: "10px 14px", marginBottom: 12, fontSize: 13 }}>
                <strong style={{ color: "#C00000" }}>EXAM TRAP: </strong><span style={{ color: "#C00000" }}>{block.text}</span>
              </div>
            );
            if (block.type === "key") return (
              <div key={bi} style={{ background: "#F5EEFB", border: "1px solid #7B3F9E55", borderLeft: "4px solid #7B3F9E", borderRadius: 8, padding: "10px 14px", marginBottom: 12, fontSize: 13 }}>
                <strong style={{ color: "#7B3F9E" }}>KEY POINT: </strong><span style={{ color: "#333" }}>{block.text}</span>
              </div>
            );
            if (block.type === "subtitle") return <h3 key={bi} style={{ fontSize: 15, fontWeight: 700, color: "#1F3864", margin: "16px 0 8px" }}>{block.text}</h3>;
            if (block.type === "text") return <p key={bi} style={{ fontSize: 13, color: "#444", lineHeight: 1.6, marginBottom: 12 }}>{block.text}</p>;
            if (block.type === "bullet") return (
              <ul key={bi} style={{ margin: "0 0 12px 0", paddingLeft: 20 }}>
                {block.items.map((item, ii) => <li key={ii} style={{ fontSize: 13, marginBottom: 6, lineHeight: 1.5 }}>{item}</li>)}
              </ul>
            );
            return null;
          })}
        </div>
      ))}
    </div>
  );
}
