const form = document.querySelector("#itemform");
const inputItem = document.querySelector("#iteminput");
const itemslist = document.querySelector("#itemslist");
const filter = document.querySelectorAll(".nav-item");

let todoItems = [];

// set in local storage

const setlocalStorage = function (todoItems) {
    localStorage.setItem("todoItems", JSON.stringify(todoItems));
}

// get data from local storage
const getlocalStorage = function () {
    const todoStorage = localStorage.getItem("todoItems")//todoitems are keys of data which are stored in local storage  
    if (todoStorage === null) {
        todoItems = [];
    }
    else {
        todoItems = JSON.parse(todoStorage);
    }
    console.log(todoItems);
    getlist(todoItems);
}

//Handle items using Done,Edit ANd Delete Button
const handleItem=function (itemData) {
    const items=document.querySelectorAll('.list-group-item');
    items.forEach((item)=>{
        if (item.querySelector('.title').getAttribute('data-time')==itemData.addedAt) {
            //data-done
            item.querySelector("[data-done]").addEventListener("click",function (e) {
                e.preventDefault();
                const itemIndex=todoItems.indexOf(itemData);
                const currentItem=todoItems[itemIndex];
                const currentClass=currentItem.isDone?"bi-check-circle-fill":"bi-check-circle";
                currentItem.isDone=currentItem.isDone?false:true;
                todoItems.splice(itemIndex,1,currentItem);
                setlocalStorage(todoItems)
                //color change
                const iconClass=currentItem.isDone?"bi-check-circle-fill":"bi-check-circle";
                this.firstElementChild.classList.replace(currentClass,iconClass);
                const filterValue=document.querySelector("#tabvalue").value;
                getItemFilter(filterValue);
            })

            // data-edit
            item.querySelector("[data-edit]").addEventListener("click",function (e) {
                e.preventDefault();
                inputItem.value=itemData.name;
                document.querySelector('#objIndex').value=todoItems.indexOf(itemData);
            });
              // data-delete
              item.querySelector("[data-delete]").addEventListener("click",function (e) {
                e.preventDefault();
               if (confirm("are you want to delete this item?")) {
                   itemslist.removeChild(item);
                   removeItem(item);
                   setlocalStorage(todoItems);
                   return todoItems.filter((items)=>item!=itemData)
               }
            });

        }
    })
}
// update item using edit button
const updateItem=function (currentItemIndex,value) {
    const newItem=todoItems[currentItemIndex];
    newItem.name=value;
    todoItems.splice(currentItemIndex,1,newItem);
    setlocalStorage(todoItems);
}
// delete using deleete button
const removeItem=function (items) {
    const removeIndex=todoItems.indexOf(items);
    todoItems.splice(removeIndex,1);
}


// get list 
const getlist = function (todoItems) {
    itemslist.innerHTML = "";
    if (todoItems.length > 0) {
        todoItems.forEach((items) => {
            const iconClass=items.isDone?"bi-check-circle-fill":"bi-check-circle";
            itemslist.insertAdjacentHTML("beforeend",
            ` <li class="list-group-item d-flex justify-content-between align-items-center">
                    <span class="title" data-time="${items.addedAt}">${items.name}</span>
                <span >
                    <a href="#" data-done><i class="bi ${iconClass} mx-2 blue"></i></a>
                    <a href="#" data-edit><i class="bi bi-pencil-square mx-2 blue"></i></a>
                    <a href="#" data-delete><i class="bi bi-x-octagon mx-2 dark-red"></i></a>
                </span>
            </li>`
            )
            handleItem(items);
        });
    }
}
//filter
const getItemFilter=function (type) {
    let filterItem=[];
    switch (type) {
        case "todo":
            filterItem=todoItems.filter((item)=>!item.isDone);
            break;
        case "done":
            filterItem=todoItems.filter((item)=>item.isDone);
            break;
        default:
            filterItem=todoItems;
            break;
    }
    getlist(filterItem)
}

document.addEventListener('DOMContentLoaded', () => {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const itemName = inputItem.value.trim()
        if (itemName.length === 0) {
            alert("enter items");
        }
        else {
            const currentItemIndex=document.querySelector('#objIndex').value;
            if (currentItemIndex) {
                updateItem(currentItemIndex,itemName);
                document.querySelector('#objIndex').value="";
            }
            else{
                const itemObj = {
                    name: itemName,
                    isDone: false,
                    addedAt: new Date().getTime()
                }
                todoItems.push(itemObj);
                setlocalStorage(todoItems)
            }
            getlist(todoItems)
        }
        inputItem.value="";
        // console.log(itemName);
    })
    //filters
    filter.forEach((tab)=>{
        tab.addEventListener("click",function (e) {
            e.preventDefault();
            const tabtype=this.getAttribute("data-type");
           document.querySelectorAll(".nav-link").forEach(nav=>{
               nav.classList.remove("active")
           })
           this.firstElementChild.classList.add("active");
           getItemFilter(tabtype);
           document.querySelector("#tabvalue").value=tabtype;
        })
    })
    //load items
    getlocalStorage();
})