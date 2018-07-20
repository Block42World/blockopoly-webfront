// Land
//
// Control lands
class Land
{
    
    constructor(x, y, w, h, owned, sale, description) {
        this._x = x;
        this._y = y;
        this._w = w;
        this._h = h;
        this._owned = owned;
        this._sale = sale;
        this._description = description;
    }

    static init(landsJson, myLandsJson)
	{
        // Load the lands info from JSON, this will be replaced by Blockchain call later
        landsJson.forEach(jsonElement => {
            var land = new Land(jsonElement.x, jsonElement.y, jsonElement.w, jsonElement.h, jsonElement.owned, jsonElement.sale, jsonElement.description);
            Land.lands.push(land);
            Land.landsOb[[land._x, land._y]] = land;
        });
        myLandsJson.forEach(jsonElement => {
            if (Land.landsOb[[jsonElement.x, jsonElement.y]] !== undefined)
                Land.myLands.push(Land.landsOb[[jsonElement.x, jsonElement.y]]);
        });
    }

    // Get the land at (x,y), return undefined if no land at that point
    static getLand(x, y)
    {
        var result;
        Land.lands.some(land => {
            if (x >= land._x - land._w / 2 && 
                x <= land._x + land._w / 2 &&
                y >= land._y - land._h / 2 && 
                y <= land._y + land._h / 2) {
                result = land
                return true;
            }
        });
        return result;
    }

    // Check if a given Land object is mine
    static isMyLand(land)
    {
        return Land.myLands.includes(land);
    }

    // Check if a given position is the land of mine, return false if no land at that point
    static isMyLandByPos(x, y)
    {
        var land = Land.getLand(x, y);
        console.log(land);
        if (land !== undefined) {
            return Land.isMyLand(land);
        }
        return false;
    }

    // Debug print all lands
    static printLands()
    {
        Land.lands.forEach(land => {
            console.log(land);
        })
    }

    // Debug print all my lands
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