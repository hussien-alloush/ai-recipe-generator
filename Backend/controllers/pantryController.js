import PantryItem from '../models/PantryItem.js';


//get all pantry items for user
export const getPantryItems = async (req, res, next) => {
    try {
        const {category, is_running_low, search} = req.query;
        const items = await PantryItem.findByUserId(req.user.id, {
            category,
            is_running_low: is_running_low === 'true' ? true : undefined,
            search
        });

        res.json({
            Success: true,
            data:{items}
        });
    } catch (err) {        next(err);
    }

};
//get pantry stats
export const getPantryStats = async (req, res, next) => {
    try {
        const stats = await PantryItem.getStatus(req.user.id);
        res.json({
            Success: true,
            data:{stats}
        });
    } catch (err) {        next(err);
    }
};
//get item exoiring soon
export const getExpiringSoon = async (req, res, next) => {
    try {
        const days = parseInt(req.query.days) || 7; // default to 7 days if not provided
        const items = await PantryItem.getExpiringsoon(req.user.id, days);

        res.json({
            Success: true,
            data:{items}
        });
    } catch (err) {        next(err);
    }
};

//add pantry item
export const addPantryItem = async (req, res, next) => {
    try {
        const item = await PantryItem.create(req.user.id, req.body);
        res.status(201).json({
            Success: true,
            message: 'Pantry item added successfully',
            data:{item}
        });
    } catch (err) {        next(err);
    }

};
//update pantry item
export const updatePantryItem = async (req, res, next) => {
    try {
        const {id} = req.params;
        const item = await PantryItem.update(id, req.user.id, req.body);
        if (!item) {
            return res.status(404).json({
                Success: false,
                message: 'Pantry item not found'
            });
        }
        res.json({
            Success: true,
            message: 'Pantry item updated successfully',
            data:{item}
        });
    } catch (err) {        next(err);
    }
};
//delete pantry item
export const deletePantryItem = async (req, res, next) => {
    try {
        const {id} = req.params;
        const item = await PantryItem.delete(id, req.user.id);
        if (!item) {
            return res.status(404).json({
                Success: false,
                message: 'Pantry item not found'
            });
        }
        res.json({
            Success: true,
            message: 'Pantry item deleted successfully',
            data:{ item }
        });
    }catch (err) {        next(err);
    }   
};


