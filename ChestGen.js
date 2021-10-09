/*
ChestGenerator Author: qazwseer2
Additional functions:
- Limitation of issued armor to 1 full set in 1 chest
- Ability to specify the size of the stack of items that may not stack64
*/
var slotLen = 18// There are slots in the chest, there are 27 of them, so in this variable you can specify BEFORE how many slots the chest will occupy
var items =  ["minecraft:dirt","minecraft:grass","minecraft:golden_apple"]// Items that will be randomly placed in the chest in random order
// - To increase the chance of an item falling out - increase the number of repetitions of its name in variable 'items'
var arrowEnch = ["minecraft:poison","minecraft:healing","minecraft:slowness","minecraft:leaping", "minecraft:long_swiftness"]// Effects for minecraft:tipped_arrow, if written above
var stack64 = [32,48]// Limit the stack for items that can stack 64 items / slot
var stack16 = [2,5]// Limit the stack for items that can stack 16 items / slot
var arrow = [16,32]// Stack limit for minecraft:tipped_arrow, if they are in the list
var isApple16 = true// Will minecraft: golden_apple be counted as stack16, if true - will be, if false - won't

function ri(min, max) {var rand = min + Math.random() * (max + 1 - min); return Math.floor(rand);}
function interact(e) {
    var Arml = {"1":false,"2":false,"3":false,"4":false}
    e.API.executeCommand(e.player.world,"/setblock"+e.block.getX()+" "+e.block.getY()+1+" "+e.block.getZ()+" minecraft:air")
    e.block.world.setBlock(e.block.getX(),e.block.getY()+1,e.block.getZ(),"minecraft:chest",0)
    var chest = e.block.world.getBlock(e.block.getX(),e.block.getY()+1,e.block.getZ()).getContainer()
    for (var i = 0; i<slotLen;i++) {
        try{
        var slot = ri(0,26)
        if (chest.getSlot(slot).getName() == "minecraft:air") {
            var item = items[ri(0,items.length)]
            if (e.block.world.createItem(item,0,1).getType() == 3) {
                if (Arml[String(e.block.world.createItem(item,0,1).getArmorSlot())] == true) {
                    break
                }  else {
                    Arml[String(e.block.world.createItem(item,0,1).getArmorSlot())] = true
                }
            }
            if (e.block.world.createItem(item,0,1).getMaxStackSize() == 1) {
                chest.setSlot(slot, e.block.world.createItem(item,0,1))
            }
            if (e.block.world.createItem(item,0,1).getMaxStackSize() == 16 || item == "minecraft:golden_apple" && isApple16 == true) {
                chest.setSlot(slot, e.block.world.createItem(item,0,ri(stack16[0],stack16[1])))
            }
            if (e.block.world.createItem(item,0,1).getMaxStackSize() == 64&& ((item != "minecraft:golden_apple")||(isApple16 == false))&&item != "minecraft:tipped_arrow") {
                chest.setSlot(slot, e.block.world.createItem(item,0,ri(stack64[0],stack64[1])))
            }
            if (item == "minecraft:tipped_arrow") {
                var itemsd = e.block.world.createItemFromNbt(e.API.stringToNbt("{id\": \"minecraft:tipped_arrow\",\"Count\": "+ri(arrow[0],arrow[1])+"b,\"tag\": {\"Potion\":\""+arrowEnch[ri(0,arrowEnch.length-1)]+"\"}}}"))
                chest.setSlot(slot, itemsd)
            }
        } 
    } catch{print("Ouch! Cant Create Item!")}
    }
}