// Land
//
// Control lands
class Land
{
    
    constructor(x, y, w, h, owned, sale) {
        this._x = x;
        this._y = y;
        this._w = w;
        this._h = h;
        this._owned = owned;
        this._sale = sale;
    }

    static init(landsJson, myLandsJson)
	{
        // Load the lands info from JSON, this will be replaced by Blockchain call later
        landsJson.forEach(jsonElement => {
            var land = new Land(jsonElement.x, jsonElement.y, jsonElement.w, jsonElement.h, jsonElement.owned, jsonElement.sale);
            Land.lands.push(land._x, land._y, land._w, land._h, land._owned, land._sale);
            Land.landsOb[[land._x, land._y]] = land;
        });
        console.log(Land.landsOb);
        myLandsJson.forEach(jsonElement => {
            print(jsonElement.x + "|" + jsonElement.y);
            if (Land.landsOb[[jsonElement.x, jsonElement.y]] !== undefined)
                Land.myLands.push(jsonElement);
        });
    }

    static getLand(x, y)
    {
        var result;
        Land.lands.every(land => {
            if (x >= land._x - land._w / 2 && 
                x <= land._x + land._w / 2 &&
                y >= land._y - land._h / 2 && 
                x <= land._y + land._h / 2) {
                result = land
                return false;
            }
        });
        return result;
    }

    static printLands()
    {
        Land.lands.forEach(land => {
            console.log(land);
        })
    }

    static printMyLands()
    {
        Land.myLands.forEach(land => {
            console.log(land);
        })
    }

}

Land.lands = [];
Land.landsOb = {};
Land.myLands = [];