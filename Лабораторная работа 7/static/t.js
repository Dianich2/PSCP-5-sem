fetch('t.json')
.then(res=>{
    if(res.ok){
        return res.json();
    }
})
.then(json=>{
    document.getElementById('json-container').innerHTML = JSON.stringify(json, null, 2);

})
.catch(err=>{
    document.getElementById('json-container').innerHTML = 'Error: json does not load';
});

fetch('t.xml')
.then(res=>{
    if(res.ok){
        return res.text();
    }
})
.then(xml=>{
    document.getElementById('xml-container').innerHTML = xml;

})
.catch(err=>{
    document.getElementById('xml-container').innerHTML = 'Error: xml does not load';
});