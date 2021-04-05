import produce, {enableES5} from 'immer';

export default (...args) =>{
    enableES5();
    return produce(...args); 
}
 //ie 11에서 하기 위한 옵션 