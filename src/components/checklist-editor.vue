<template>
    <div class="checklist-editor">
        <label>Checklist Name</label>
        <form 
            class= "checklist-name" 
            @submit.prevent = "">
            <input 
                v-model = "checklistName" 
                class="form-control" 
                type = "text"/>
        </form>
        <ul class="list-group">
            <li
                v-for = "(item, index) in itemList"
                :key = "item.key"
                class="list-group-item flex-item"
            >
                <div class="row">
                    <div class="col-xs-7">
                        <span class="item">{{ index + 1 }} : {{ item.listItemText }}</span>
                    </div>
                    <div class="col-xs-5">
                        <div style="text-align:right">
                            <button
                                class="btn btn-danger remove-button"
                                @click.prevent="deleteItem(index)">
                                x
                            </button>
                            <button
                                :disabled = "index == 0"
                                class="btn btn-success remove-button"
                                @click.prevent="up(index)">
                                &uparrow;
                            </button>
                            <button
                                :disabled = "index == itemList.length-1"
                                class="btn btn-success remove-button"
                                @click.prevent="down(index)">
                                &downarrow;
                            </button>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
        <form
            class="form-group form-box"
            @submit.prevent = "add">
            <label>New Item</label>
            <input
                v-model = "newItemInput"
                class="form-control"
                type="text"
            />
            <input
                :disabled = "newItemInput == ''"
                class="btn btn-default add-button"
                type="submit"
                value = "add new item"
            />
        </form>
        <a 
            :disabled = "itemList.length == 0" 
            class="btn btn-success" 
            @click.prevent = "save">save</a>
        <a 
            class="btn btn-default" 
            @click.prevent = "cancel">
            cancel
        </a>
    </div>
</template>
<script>
import {DrawerDiv} from "cross-vue-base";
import {StringHash} from "../helpers/string-hash.js";

export default {
    components : {
        DrawerDiv
    },
    props : {
        currentChecklist : {
            type : Object,
            default : function() {
                return { 
                    checklistName : "",
                    itemList : []
                }
            } 
        }
    },
    data () {
        return {
            newItemInput : "",
            itemList : [],
            storeLocal : {},
            checklistName : ""
        }
    },
    computed : {
    },
    watch : {
        currentChecklist () {
            this.update();
        }
    },
    mounted () {
        window.editor = this;
        this.update();
    },
    methods : {
        update () {
            if (this.currentChecklist.items) {
                this.checklistName = this.currentChecklist.name;
                for (let i = 0; i < this.currentChecklist.items.length; i++) {
                    this.itemList.push(this.currentChecklist.items[i]);
                }
            }
        },
        add () {
            if (this.newItemInput == "") {
                return;
            }
            this.itemList.push({
                listItemText : this.newItemInput,
                key : StringHash(this.newItemInput) + ":" + performance.now()
            });
            this.newItemInput = "";
        },
        deleteItem (index) {
            if(confirm("Remove item \"" + this.itemList[index].listItemText + "\"", "Check")) {
                this.itemList.splice(index,1);
            }
        },
        up (index) {
            if (index > 0) {
                let aboveIndex = index - 1;
                let placeholder = this.itemList[index];
                this.$set(this.itemList, index, this.itemList[aboveIndex]);
                this.$set(this.itemList, aboveIndex, placeholder);
            }
        },
        down (index) {
            if (index + 1 < this.itemList.length) {
                let belowIndex = index + 1;
                let placeholder = this.itemList[index];
                this.$set(this.itemList, index, this.itemList[belowIndex]);
                this.$set(this.itemList, belowIndex, placeholder);
            }
        },
        save () {
            if (this.checklistName == "") {
                alert("Checklist Name is required");
                return;
            }
            this.$emit("event_save", {
                name : this.checklistName,
                items : this.itemList
            });
        },
        cancel () {
            if (confirm("Discard changes?", "Check")) {
                this.$emit("event_cancel");
            }
        }
    }
}
</script>
<style lang="scss">
.checklist-editor {
    .checklist-name {
        margin-bottom:1em;
    }
    .add-button {
        margin-top: 1em;
    }
    .flex-item {
        .form-box {
            margin-bottom: 2em;
        }
    }
    select, textarea, input[type="text"], input[type="password"], input[type="datetime"], input[type="datetime-local"], input[type="date"], input[type="month"], input[type="time"], input[type="week"], input[type="number"], input[type="email"], input[type="url"], input[type="search"], input[type="tel"], input[type="color"] { font-size: 16px; }
}
</style>
