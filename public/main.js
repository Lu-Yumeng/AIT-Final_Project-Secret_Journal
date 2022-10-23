function main(){
    let journalname ="";
    if (document.querySelector("form")){
        journalname = document.querySelector("form").querySelector('input[name="listSlug"]').value;
    }
    const divtable = document.querySelectorAll("div#journaltable");
    divtable.forEach(ele=>{
        const children = ele.querySelector("label#editbtn");
        const child = children.querySelector("input#edit");
        child.addEventListener('click',edit);
        async function edit(evt){
            evt.preventDefault();
            this.disabled = true;
            const datetime = ele.childNodes[1].textContent;
            const word = ele.childNodes[3].textContent;
            const _id = ele.querySelector('input[name="_id"]').value;
            const d = generateDiv(this,datetime,word,journalname,_id);
            ele.appendChild(d);
        }

        const deletelabel = ele.querySelector("label#deletebtn");
        const deletebtn = deletelabel.querySelector("input#delete");
        deletebtn.addEventListener('click',deleted);
        async function deleted(evt){
            console.log("you click on the delete button");
            if (confirm("Are you sure you want to delete this journal?") == true) {
                const cur_url= window.location.href;
                let url = new URL(cur_url);
                // console.log(url);
                const origin = url.origin;
                const newUrl= origin+'/api/delete';
                // console.log(newUrl);
                const config={
                    method:"POST",
                    headers:{
                        "Content-Type" :'application/json',
                    },
                    body: JSON.stringify({
                        "_id":ele.querySelector('input[name="_id"]').value,
                        "name":journalname,
                    })
                }
                // console.log(newUrl);
                const res = await fetch(newUrl,config);
                const msg = await res.json();
                console.log("Your button should be moved until now");
                ele.remove();
              }
        }
    })
}

function generateDiv(editbtn,datetime,word,journal,_id){
    const div = document.createElement('div');
    const form = document.createElement("form");
    form.setAttribute("method","POST");
    form.setAttribute("action",'/list-journals/edit');

    const date = document.createElement("input");
    date.setAttribute("type","date");
    date.setAttribute("name","date");
    date.setAttribute("value",datetime);

    const content = document.createElement("textarea");
    content.setAttribute("type","text");
    content.setAttribute("name","content");
    content.setAttribute("cols","40");
    content.setAttribute("rows","5")
    content.setAttribute("required","");
    content.setAttribute("placeholder",word);
    console.log(content);

    const submit = document.createElement("input");
    submit.setAttribute("type","submit");
    submit.setAttribute("value","Edit");

    const cancel = document.createElement("input");
    cancel.setAttribute("type","submit");
    cancel.setAttribute("value","Cancel");

    // cancel add eventlistener
    cancel.addEventListener('click',cancelled)
    async function cancelled(evt){
        evt.preventDefault();
        editbtn.disabled = false;
        div.remove();
    }

    const id = document.createElement("input");
    id.setAttribute("type","hidden");
    id.setAttribute("value",_id);
    id.setAttribute("name","_id");

    const journalinput = document.createElement("input");
    journalinput.setAttribute("type","hidden");
    journalinput.setAttribute("value",journal);
    journalinput.setAttribute("name","listSlug");

    form.appendChild(date);
    form.appendChild(content);
    form.appendChild(submit);
    form.appendChild(cancel);
    form.appendChild(journalinput);
    form.appendChild(id);

    div.appendChild(form);
    return div;
}
document.addEventListener("DOMContentLoaded", main);
