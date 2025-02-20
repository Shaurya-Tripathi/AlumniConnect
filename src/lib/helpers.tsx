import { v4 as uuidv4 } from 'uuid';

export const getUniqueID = ()=>{
    let id = uuidv4();
    return id;
}
