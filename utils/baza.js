const Sequelize = require("sequelize");
const path = require('path');
const sequelize = new Sequelize("wt2018347", "root", "root", {
    host: "127.0.0.1",
    dialect: "mysql"
});

const db={};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//db.aktivnost = sequelize.import(__dirname+'./utils/aktivnost.js');
db.aktivnost = require(path.join(__dirname+'/aktivnost.js'))(sequelize, Sequelize.DataTypes);
db.dan = require(path.join(__dirname+'/dan.js'))(sequelize, Sequelize.DataTypes);
db.grupa = require(path.join(__dirname+'/grupa.js'))(sequelize, Sequelize.DataTypes);
db.predmet = require(path.join(__dirname+'/predmet.js'))(sequelize, Sequelize.DataTypes);
db.student = require(path.join(__dirname+'/student.js'))(sequelize, Sequelize.DataTypes);
db.tip = require(path.join(__dirname+'/tip.js'))(sequelize, Sequelize.DataTypes);

//Relacije
//Predmet 1-N Grupa
db.predmet.hasMany(db.grupa,{foreignKey:{allowNull:false}});
db.grupa.belongsTo(db.predmet);
//Aktivnost N-1 Predmet
db.predmet.hasMany(db.aktivnost,{foreignKey:{allowNull:false}});
db.aktivnost.belongsTo(db.predmet,{foreignKey:{allowNull:false}});
//Aktivnost N-0 Grupa
db.grupa.hasMany(db.aktivnost);
db.aktivnost.belongsTo(db.grupa);
//Aktivnost N-1 Dan
db.dan.hasMany(db.aktivnost,{foreignKey:{allowNull:false}});
db.aktivnost.belongsTo(db.dan);
//Aktivnost N-1 Tip
db.tip.hasMany(db.aktivnost,{foreignKey:{allowNull:false}});
db.aktivnost.belongsTo(db.dan);
//Student N-M Grupa
db.studentGrupe = db.student.belongsToMany(db.grupa,{through:'student-grupa',foreignKey:'studentId'});
db.grupa.belongsToMany(db.student,{through:'student_grupa',foreignKey:'grupaId'});


module.exports = db;