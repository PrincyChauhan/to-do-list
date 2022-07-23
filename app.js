const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extenend: true }))
app.use(express.static("public"))
app.set("view engine", "ejs");

let items = ["Buy food", "Cook food", "Eat food"];
let workItems = [];
app.get('/', (req, res) => {
    let today = new Date()
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }
    let day = today.toLocaleDateString("en-US", options)
    res.render("list", { listTitle: day, newItemList: items })
})

app.post('/', (req, res) => {
    let item = req.body.newItem
    if (req.body.list == "Work") {
        workItems.push(item)
        res.redirect('/work')
    } else {
        items.push(item)
        res.redirect('/')
    }
})

app.get('/work', (req, res) => {
    res.render("list", { listTitle: "Work List", newItemList: workItems })

})

app.listen(3000, () => {
    console.log("Server is listing on Port no 3000")
})