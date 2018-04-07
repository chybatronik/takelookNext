import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import reducers from './reducers'
import { composeWithDevTools } from 'redux-devtools-extension'

const middleware = [ thunk ]
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger())
}

const initialState = {
  shows:{
    shows: {},
    config: {
      isFetch: false,
      isError: false,
      page: 0
    }
  },
  episodes:{}
}
// export const initStore = (initialState = initialState) => {
//   return createStore(reducers, composeWithDevTools(applyMiddleware(...middleware)))
// }

export const makeStore = (initialState = initialState) => {
  return createStore(reducers, initialState,  composeWithDevTools(applyMiddleware(...middleware)))
}
