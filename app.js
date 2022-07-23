const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const date = require('./date');
const app = express();

app.use(bodyParser.urlencoded({ extenend: true }))
app.use(express.static("public"))
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/toDOListDB", { useNewUrlParser: true });
const itemSchema = {
    name: String
}
const Item = mongoose.model("Item", itemSchema)

const item1 = new Item({
    name: "Welcome to your todoList",
});

const item2 = new Item({
    name: "Hit the + button to add a new list",
});

const item3 = new Item({
    name: "<-- Hit this to delete an item.",
});

const defaultItems = [item1, item2, item3];


app.get('/', (req, res) => {
    Item.find({}, (err, foundItems) => {
        if (foundItems.length == 0) {
            Item.insertMany(defaultItems, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("done");
                }
            })
            res.redirect("/");
        } else {
            res.render("list", { listTitle: "Today", newItemList: foundItems })
        }
    })
})

app.post('/', (req, res) => {
    let itemName = req.body.newItem
    const item =new Item({
        name:itemName
    })
    item.save();
    res.redirect("/")
 
})

app.get('/work', (req, res) => {
    res.render("list", { listTitle: "Work List", newItemList: workItems })

})

app.listen(3000, () => {
    console.log("Server is listing on Port no 3000")
})