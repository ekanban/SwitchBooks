function allPlugins(schema){
    schema.pre('save', function(next){
        var modelName = this.constructor.modelName;
        console.log(`Coming from plugins file. ${modelName} model pre.save`);
        next();
    })
}


module.exports = allPlugins;