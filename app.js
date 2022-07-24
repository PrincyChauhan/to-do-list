const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");


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
const listSchema = {
    name: String,
    items: [itemSchema]
}
const List = mongoose.model("List", listSchema)


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
    let listName = req.body.list
    const item = new Item({
        name: itemName
    })
    if (listName === "Today") {
        item.save();
        res.redirect("/")
    } else {
        List.findOne({ name: listName }, (err, foundList) => {
            foundList.items.push(item)
            foundList.save()
            res.redirect("/" + listName)
        })
    }
})

app.post('/delete', (req, res) => {
    const checkedItemId = req.body.checkbox;
    let listName = req.body.listName;
    if (listName == "Today") {

        Item.findByIdAndRemove(checkedItemId, (err) => {
            if (!err) {
                res.redirect("/")
            }
        })
    } else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }, (err, foundList) => {
            if (!err) {
                res.redirect("/" + listName)
            }
        })
    }
})

app.get('/:customListName', (req, res) => {
    const customListName = _.capitalize(req.params.customListName)
    List.findOne({ name: customListName }, (err, foundList) => {
        if (!err) {
            if (!foundList) {
                const list = new List({
                    name: customListName,
                    items: defaultItems
                })
                list.save()
                res.redirect("/" + customListName)
            } else {
                res.render("list", { listTitle: foundList.name, newItemList: foundList.items })
            }
        }
    })
})

app.listen(3000, () => {
    console.log("Server is listing on Port no 3000")
})