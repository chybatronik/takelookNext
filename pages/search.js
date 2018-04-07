import React, { Component } from 'react'
import * as actions from '../store/actions/shows'
import { Row, Col, Spin, Alert } from 'antd'
import ShowComponent from '../components/show'
import { makeStore } from '../store'
import NavigateApp from '../components/Layout.js'
import Router from 'next/router'
import withRedux from 'next-redux-wrapper'

export class SearchContainer extends Component {
  static async getInitialProps (params) {
    const {query, store, isServer} = params
    console.log('getInitialProps SearchContainer', query.name)
    await store.dispatch(actions.getSearchShows(query.name))
    return {...store.getState(), queryName: query.name}
  }

  renderLoader () {
    const { config } = this.props.shows
    if (config.isError) {
      return (
        <NavigateApp title={'Ошибка '}>
          <Alert message='Ошибка получения данных с сервера' type='error' />
        </NavigateApp>
      )
    }
    return (
      <NavigateApp title={'Ошибка '}>
        <div className='spiner' key={'spiner'}>
          <Spin size='large' />
        </div>
      </NavigateApp>
    )
  }

  handleOnClick = ( id ) => {
    Router.push({
     pathname: '/details',
     query: { id: id }
   })
  }

  render () {
    const { shows, config } = this.props.shows
    if (config.isFetch || config.isError) {
      return this.renderLoader(config)
    }
    const results = Object.keys(shows).map((item) => {
      return (
        <Col xs={{ span: 12 }} sm={{ span: 8 }} md={{ span: 6 }}  lg={{ span: 4 }} style={{paddingBottom: 20}} key={item}>
          <ShowComponent handleOnClick={this.handleOnClick} show={shows[item]} key={item} />
        </Col>
      )
    })

    return (
      <NavigateApp title={'Вы искали ' + this.props.queryName} queryName={this.props.queryName}>
        <Row gutter={16}>
          <h2>Вы искали: {this.props.queryName}</h2>
        </Row>
        <Row gutter={16}>
          {results}
        </Row>
      </NavigateApp>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  getSearchShows: (query) => dispatch(actions.getSearchShows(query))
})

const mapStateToProps = state => {
  const { shows } = state
  return {
    shows
  }
}

export default withRedux(makeStore, mapStateToProps, mapDispatchToProps)(SearchContainer)
