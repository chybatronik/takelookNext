import React, { Component } from 'react'
import * as actions from '../store/actions/shows'
import * as actionsEpisodes from '../store/actions/episodes'
import { Row, Col, Tag, Alert, Spin, Card, Table, Icon } from 'antd'
import { makeStore } from '../store'
import NavigateApp from '../components/Layout.js'
import withRedux from 'next-redux-wrapper'

const CheckableTag = Tag.CheckableTag

export class DetailsConatiner extends Component {
  static async getInitialProps ({query, store, isServer}) {
    console.log('getInitialProps DetailsConatiner')
    const state = store.getState()
    const { shows } = state.shows
    const show = shows[query.id]
    if (!show) {
      if (!state.shows.config.isFetch) {
        await store.dispatch(actions.getOneShow(query.id))
      }
    }

    const { episodes } = state.episodes
    const showEpisodes = episodes[query.id]
    if (!showEpisodes) {
      await store.dispatch(actionsEpisodes.getShowEpisodes(query.id))
    }
    return {...store.getState(), queryId: query.id, isServer}
  }

  componentDidMount () {
    window.scrollTo(0, 0)
  }

  renderLoader (config) {
    if (config.isError) {
      return (
        <NavigateApp title={'Ant Design'}>
          <Alert message='Ошибка получения данных с сервера' type='error' />
        </NavigateApp>
      )
    }
    return (
      <NavigateApp title={'Ant Design'}>
        <div className='spiner' key={'spiner'}>
          <Spin size='large' />
        </div>
      </NavigateApp>
    )
  }

  renderEpisodes () {
    const { episodes } = this.props.episodes
    const showEpisodes = episodes[this.props.queryId]
    if (!showEpisodes || showEpisodes.isFetch || showEpisodes.isError) {
      if (showEpisodes) {
        return this.renderLoader(showEpisodes)
      }
      return this.renderLoader({isFetch: true})
    }

    const dataSource = Object.keys(showEpisodes).map((id) => {
      const item = showEpisodes[id]
      return {
        name: `${item.season}x${item.number} ${item.name}`,
        age: item.airdate,
        address: item.url,
        key: item.id
      }
    })
    const columns = [{
      title: 'Episode Name',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: 'Airdate',
      dataIndex: 'age',
      key: 'age'
    }, {
      title: 'Trailer',
      dataIndex: 'address',
      key: 'address',
      render: text => <a href={text}><Icon type='play-circle' /></a>
    }]
    return (
      <Table dataSource={dataSource} columns={columns} />
    )
  }

  render () {
    const { shows, config } = this.props.shows
    const show = shows[this.props.queryId]
    if (show) {
      return (
        <NavigateApp title={'Ant Design'}>
          <Row>
            <Col xs={{ span: 16, push: 8 }} sm={{ span: 16, push: 8 }} md={{ span: 16, push: 8 }} lg={{ span: 16, push: 8 }} >
              <h1>{show.name}</h1>
              <div style={{marginBottom: 20, marginTop: 10}}>
                {
                  show.genres.map(tag => (
                    <CheckableTag
                      key={tag}
                    >
                      {tag}
                    </CheckableTag>
                  ))
                }
              </div>
              <h3>{show.premiered}</h3>
              <h3>Rating: {show.rating.average}</h3>
              <h3>Language: {show.language}</h3>
              <div dangerouslySetInnerHTML={{__html: show.summary}} />
              { this.renderEpisodes() }
            </Col>
            <Col xs={{ span: 6, pull: 16 }} sm={{ span: 6, pull: 16 }} md={{ span: 6, pull: 16 }} lg={{ span: 6, pull: 16 }} >
              <Card
                hoverable
                cover={<img alt='example' src={show.image && show.image.medium ? show.image.medium : 'https://placeimg.com/210/295/any'} />}
              />
            </Col>
          </Row>
        </NavigateApp>
      )
    }
    return this.renderLoader(config)
  }
}

const mapDispatchToProps = (dispatch) => ({
  getOneShow: (id) => dispatch(actions.getOneShow(id)),
  getShowEpisodes: (id) => dispatch(actionsEpisodes.getShowEpisodes(id))
})

const mapStateToProps = state => {
  const { shows, episodes } = state
  return {
    shows,
    episodes
  }
}

export default withRedux(makeStore, mapStateToProps, mapDispatchToProps)(DetailsConatiner)
