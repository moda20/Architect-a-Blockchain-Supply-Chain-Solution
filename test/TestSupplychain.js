// This script is designed to test the solidity smart contract - SuppyChain.sol -- and the various functions within
// Declare a variable and assign the compiled smart contract artifact
var SupplyChain = artifacts.require('SupplyChain')

contract('SupplyChain', function(accounts) {
    //console.log(web3)
    // Declare few constants and assign a few sample accounts generated by ganache-cli
    var sku = 1
    var upc = 1
    const ownerID = accounts[0]
    const originFarmerID = accounts[1]
    const originFarmName = "John Doe"
    const originFarmInformation = "Chico Valley"
    const originFarmLatitude = "-38.239770"
    const originFarmLongitude = "144.341490"
    var productID = sku + upc
    const productNotes = "Best coconuts for gastronomic endeavors"
    const productPrice = web3.utils.toWei("1", "ether")
    var itemState = 0
    const distributorID = accounts[2]
    const retailerID = accounts[3]
    const consumerID = accounts[4]
    const emptyAddress = '0x00000000000000000000000000000000000000'
    var supplyChain

    // Available Accounts
    // ==================
    // (0) 0xfcf83e33d565a45411c7824d65084b435d5341b8
    // (1) 0xdc94ac22ec9eeddcf0fa46c0a2459b175864189c
    // (2) 0xbc0a52baff25eebc2c2a3d6ccb05db5e41f7da6e
    // (3) 0x59f48202795499a875c4d8eec510538d5365f1ce
    // (4) 0x335ca1a755db8bb13ddd6a6bb285eb91b3ec7b63
    // (5) 0xdaf8a1d66a57f41c1ad2388ce2695e19fa7d4293
    // (6) 0x45e35a3a88a7a7099e3e2bb6193f616f183b3fc7
    // (7) 0xd5bdbe82a17cb13b11ef8e467de27d1973bf9735
    // (8) 0x7271935c2a84d80d1ac7610603dc7779e967f290
    // (9) 0xcfb791e30ec831749ffc7b3cce7d913fd0d5592e


    console.log("ganache-cli accounts used here...")
    console.log("Contract Owner: accounts[0] ", accounts[0])
    console.log("Farmer: accounts[1] ", accounts[1])
    console.log("Distributor: accounts[2] ", accounts[2])
    console.log("Retailer: accounts[3] ", accounts[3])
    console.log("Consumer: accounts[4] ", accounts[4])

    // Deploy SupplyChain and Register Actors
    it("0. Deploy SupplyChain and Register Actors",
        async () => {
            supplyChain = await SupplyChain.deployed()

            // Declare and Initialize a variable for event
            var eventEmitted = false

            // Watch the emitted event FarmerAdded()
            var event = supplyChain.FarmerAdded()
            await event.watch((err, res) => {
                eventEmitted = true
                //console.log(res);
            })

            // Watch the emitted event DistributorAdded()
            var event = supplyChain.DistributorAdded()
            await event.watch((err, res) => {
                eventEmitted = true
                //console.log(res);
            })

            // Watch the emitted event RetailerAdded()
            var event = supplyChain.RetailerAdded()
            await event.watch((err, res) => {
                eventEmitted = true
                //console.log(res);
            })

            // Watch the emitted event RetailerAdded()
            var event = supplyChain.ConsumerAdded()
            await event.watch((err, res) => {
                eventEmitted = true
                //console.log(res);
            })

            // Mark an item as Harvested by calling function harvestItem()
            await supplyChain.addFarmer(originFarmerID, { from: ownerID })
            await supplyChain.addDistributor(distributorID, { from: ownerID })
            await supplyChain.addRetailer(retailerID, { from: ownerID })
            await supplyChain.addConsumer(consumerID, { from: ownerID })
        })

    // 1st Test
    it("1. Testing smart contract function harvestItem() that allows a farmer to harvest coconuts",
        async() => {
        //const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        var eventEmitted = false
        
        // Watch the emitted event Harvested()
        var event = supplyChain.Harvested()
        await event.watch((err, res) => {
            eventEmitted = true
        })

        // Mark an item as Harvested by calling function harvestItem()
        await supplyChain.harvestItem(
            upc,
            originFarmerID,
            originFarmName,
            originFarmInformation,
            originFarmLatitude,
            originFarmLongitude,
            productNotes,
            { from: originFarmerID })

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], originFarmerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
        assert.equal(resultBufferTwo[5], itemState, 'Error: Invalid item State')
        assert.equal(eventEmitted, true, 'Invalid event emitted')        
    })    

    // 2nd Test
    it("2. Testing smart contract function processItem() that allows a farmer to process coconuts", async() => {
        //const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        var eventEmitted = false

        // Watch the emitted event Processed()
        var event = supplyChain.Processed()
        await event.watch((err, res) => {
            eventEmitted = true
            itemState = 1
        })

        // Mark an item as Processed by calling function processtItem()
        await supplyChain.processItem(upc, { from: originFarmerID })

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], originFarmerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferTwo[5], itemState, 'Error: Invalid item State')
        assert.equal(eventEmitted, true, 'Invalid event emitted')  
    })    

    // 3rd Test
    it("3. Testing smart contract function packItem() that allows a farmer to pack coconuts", async() => {
        //const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        var eventEmitted = false

        // Watch the emitted event Packed()
        var event = supplyChain.Packed()
        await event.watch((err, res) => {
            eventEmitted = true
            itemState = 2
        })

        // Mark an item as Packed by calling function packItem()
        await supplyChain.packItem(upc, { from: originFarmerID })

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], originFarmerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferTwo[5], itemState, 'Error: Invalid item State')
        assert.equal(eventEmitted, true, 'Invalid event emitted')
        
    })    

    // 4th Test
    it("4. Testing smart contract function sellItem() that allows a farmer to sell coconuts", async() => {
        //const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        var eventEmitted = false

        // Watch the emitted event ForSale()
        var event = supplyChain.ForSale()
        await event.watch((err, res) => {
            eventEmitted = true
            itemState = 3
        })

        // Mark an item as ForSale by calling function sellItem()
        await supplyChain.sellItem(upc, productPrice, { from: originFarmerID })

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferTwo[4], productPrice, 'Error: Missing or Invalid productPrice')
        assert.equal(resultBufferTwo[5], itemState, 'Error: Invalid item State')
        assert.equal(eventEmitted, true, 'Invalid event emitted')
          
    })    

    // 5th Test
    it("5. Testing smart contract function buyItem() that allows a distributor to buy coconuts", async() => {
        //const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        var eventEmitted = false

        // Watch the emitted event Sold()
        var event = supplyChain.Sold()
        await event.watch((err, res) => {
            eventEmitted = true
            itemState = 4
        })

        // Mark an item as Sold by calling function buyItem()
        await supplyChain.buyItem(upc, { from: distributorID, value: productPrice })

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferTwo[4], productPrice, 'Error: Missing or Invalid productPrice')
        assert.equal(resultBufferTwo[5], itemState, 'Error: Invalid item State')
        assert.equal(resultBufferTwo[6], distributorID, 'Error: Missing or Invalid distributorID')
        assert.equal(eventEmitted, true, 'Invalid event emitted')
        
    })    

    // 6th Test
    it("6. Testing smart contract function shipItem() that allows a distributor to ship coconuts", async() => {
        //const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        var eventEmitted = false

        // Watch the emitted event Shipped()
        var event = supplyChain.Shipped()
        await event.watch((err, res) => {
            eventEmitted = true
            itemState = 5
        })

        // Mark an item as Shipped by calling function shipItem()
        await supplyChain.shipItem(upc, { from: originFarmerID })

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], distributorID, 'Error: Missing or Invalid ownerID')

        assert.equal(resultBufferTwo[5], itemState, 'Error: Invalid item State')
        assert.equal(resultBufferTwo[6], distributorID, 'Error: Missing or Invalid distributorID')
        assert.equal(eventEmitted, true, 'Invalid event emitted')
              
    })    

    // 7th Test
    it("7. Testing smart contract function receiveItem() that allows a retailer to mark coconuts received", async() => {
        //const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        var eventEmitted = false

        // Watch the emitted event Received()
        var event = supplyChain.Received()
        await event.watch((err, res) => {
            eventEmitted = true
            itemState = 6
        })

        // Mark an item as Received by calling function receiveItem()
        await supplyChain.receiveItem(upc, { from: retailerID })

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], retailerID, 'Error: Missing or Invalid ownerID')

        assert.equal(resultBufferTwo[5], itemState, 'Error: Invalid item State')
        assert.equal(resultBufferTwo[7], retailerID, 'Error: Missing or Invalid retailerID')
        assert.equal(eventEmitted, true, 'Invalid event emitted')
             
    })    

    // 8th Test
    it("8. Testing smart contract function purchaseItem() that allows a consumer to purchase coconuts", async() => {
        //const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        var eventEmitted = false

        // Watch the emitted event Purchased()
        var event = supplyChain.Purchased()
        await event.watch((err, res) => {
            eventEmitted = true
            itemState = 7
        })

        // Mark an item as Purchased by calling function purchaseItem()
        await supplyChain.purchaseItem(upc, { from: consumerID })

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')


        assert.equal(resultBufferTwo[5], itemState, 'Error: Invalid item State')
        assert.equal(eventEmitted, true, 'Invalid event emitted')
        
    })    

    // 9th Test
    it("9. Testing smart contract function fetchItemBufferOne() that allows anyone to fetch item details from blockchain", async() => {
        //const supplyChain = await SupplyChain.deployed()

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)

        // Verify the result set:
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], consumerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
        
    })

    // 10th Test
    it("10. Testing smart contract function fetchItemBufferTwo() that allows anyone to fetch item details from blockchain", async() => {
        //const supplyChain = await SupplyChain.deployed()

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set:
        assert.equal(resultBufferTwo[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferTwo[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferTwo[2], productID, 'Error: Missing or Invalid productID')
        assert.equal(resultBufferTwo[3], productNotes, 'Error: Missing or Invalid productNotes')
        assert.equal(resultBufferTwo[4], productPrice, 'Error: Missing or Invalid productPrice')
        assert.equal(resultBufferTwo[5], itemState, 'Error: Invalid item State')
        assert.equal(resultBufferTwo[6], distributorID, 'Error: Missing or Invalid distributorID')
        assert.equal(resultBufferTwo[7], retailerID, 'Error: Missing or Invalid retailerID')
        assert.equal(resultBufferTwo[8], consumerID, 'Error: Missing or Invalid consumerID')
        
    })

});
