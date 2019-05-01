import { CREATE_NEW_ORDER } from '../modules/clients';
import { MOVE_ORDER_NEXT, MOVE_ORDER_BACK } from '../actions/moveOrder';
import { ADD_INGREDIENT } from '../actions/ingredients';

// Реализуйте редьюсер
// Типы экшенов, которые вам нужно обрабатывать уже импортированы
// Обратите внимание на `orders.test.js`.
// Он поможет понять, какие значения должен возвращать редьюсер.

export default (state = [], action) => {
  const { payload } = action;
  switch (action.type) {
    case CREATE_NEW_ORDER:
      return [
        ...state,
        {
          id: payload.id,
          recipe: [...payload.recipe],
          ingredients: [],
          position: 'clients'
        }
      ];
    case MOVE_ORDER_NEXT:
      return state.map(order =>
        order.id === payload
          ? {
              ...order,
              position: getNewPositionNext(
                order.position,
                order.ingredients.length
              )
            }
          : order
      );

    case MOVE_ORDER_BACK:
      return state.map(order =>
        order.id === payload
          ? { ...order, position: getNewPositionBack(order.position) }
          : order
      );

    case ADD_INGREDIENT:
      return state.map(order => {
        const ingredient = payload.ingredient;
        if (order.position === payload.from) {
          let ingredients = order.ingredients;
          for (let i = 0; i < order.recipe.length; i++) {
            if (order.recipe[i] === ingredient) {
              ingredients.push(ingredient);
            }
          }
          return { ...order, ingredients };
        } else {
          return order;
        }
      });
    default:
      return state;
  }
};

export const getOrdersFor = (state, position) => {
  return state.orders.filter(order => order.position === position);
};

const getNewPositionNext = (position, countIngredients) => {
  switch (position) {
    case 'clients':
      return 'conveyor_1';
    case 'conveyor_1':
      return 'conveyor_2';
    case 'conveyor_2':
      return 'conveyor_3';
    case 'conveyor_3':
      return 'conveyor_4';
    case 'conveyor_4':
      return countIngredients ? 'finish' : 'conveyor_4';
    default:
      return 'conveyor_1';
  }
};

const getNewPositionBack = position => {
  switch (position) {
    case 'conveyor_1':
      return 'conveyor_1';
    case 'conveyor_2':
      return 'conveyor_1';
    case 'conveyor_3':
      return 'conveyor_2';
    case 'conveyor_4':
      return 'conveyor_3';
    default:
      return 'clients';
  }
};
