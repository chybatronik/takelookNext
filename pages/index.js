import React, { Component } from 'react'
import * as actions from '../store/actions/shows'
import { connect } from 'react-redux'
import NavigateApp from '../components/Layout.js'
import { Row, Col, Spin, Alert } from 'antd'
import InfiniteScroll from 'react-infinite-scroller'
import ShowComponent from '../components/show'
import { makeStore } from '../store'
import Router from 'next/router'
import withRedux from "next-redux-wrapper";

export class DefaultListContainer extends Component {
  static async getInitialProps (params) {
    console.log('getInitialProps DefaultListContainer')
    const {query, store, isServer} = params
    await store.dispatch(actions.getShows(0))
    return store.getState()
  }

  renderLoader () {
    const { config } = this.props.shows
    if (config.isError) {
      return (
        <Alert message='Ошибка получения данных с сервера' type='error' />
      )
    }
    return (
      <div className='spiner' key={'spiner'}>
        <Spin size='large' />
      </div>
    )
  }
  handleOnClick = (id) => {
    Router.push({
     pathname: '/details',
     query: { id: id }
   })
  }

  loadFunc = () => {
    const { config } = this.props.shows
    if(!config.isFetch)
      this.props.getShows(config.page)
  }

  render () {
    const { shows } = this.props.shows
    const results = Object.keys(shows).map((item) => {
      return (
        <Col xs={{ span: 12 }} sm={{ span: 8 }} md={{ span: 6 }}  lg={{ span: 4 }} style={{paddingBottom: 20}} key={item}>
          <ShowComponent handleOnClick={this.handleOnClick} show={shows[item]} key={item} />
        </Col>
      )
    })
    return (
      <NavigateApp title={"All shows"}>
        <InfiniteScroll
          pageStart={0}
          loadMore={this.loadFunc}
          hasMore={true}
          loader={this.renderLoader()}
        >
          <Row gutter={16}>
            {results}
          </Row>
        </InfiniteScroll>
      </NavigateApp>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  getShows: (page) => dispatch(actions.getShows(page))
})

const mapStateToProps = state => {
  const { shows } = state
  return {
    shows
  }
}


export default withRedux(makeStore, mapStateToProps, mapDispatchToProps)(DefaultListContainer)
