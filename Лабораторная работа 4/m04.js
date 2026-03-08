var util = require('util');
var ee = require('events');

// типо наша БД
var my_db = [
    {id:'1', name:'Сидоров С.С.', bday:'2001-01-01'},
    {id:'2', name:'Петров П.П.', bday:'2002-02-01'},
    {id:'3', name:'Иванов И.И.', bday:'2003-03-01'},
    {id:'4', name:'Соколов Р.О.', bday:'2004-04-01'},
    {id:'5', name:'Васильев В.В.', bday:'2005-05-01'},
];

function DB(){
    this.select = ()=> {return my_db;};
    this.insert = (p)=>{
        let cur_id = my_db.length > 0 ? Math.max(...my_db.map(p => parseInt(p.id))): 1;
        let new_record = {
            id: (cur_id + 1).toString(),
            name: p.name,
            bday: p.bday
        };
        my_db.push(new_record);
        return new_record;
    };
    this.update = (pu)=>{
        let cur_record_ind = my_db.findIndex(p => p.id === pu.id);
        if(cur_record_ind === -1){
            return null;
        }
        my_db[cur_record_ind] = {...my_db[cur_record_ind], ...pu};
        return my_db[cur_record_ind];
    };
    this.delete = (pu)=>{
        let cur_record_ind = my_db.findIndex(p => p.id === pu);
        if(cur_record_ind === -1){
            return null;
        }
        return my_db.splice(cur_record_ind.toString(), 1)[0];
    };

    this.commit = () =>{
        console.log("COMMIT");
        return;
    };
}

util.inherits(DB, ee.EventEmitter);
exports.DB = DB;