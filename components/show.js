import React from 'react'
import { Card, Tag } from 'antd'
const { Meta } = Card
const CheckableTag = Tag.CheckableTag

const ShowComponent = (props) => {
  const { image, name, genres, id } = props.show
  return (
    <Card style={{}}
      hoverable
      cover={<img alt='example' src={image && image.medium ? image.medium : 'https://placeimg.com/210/295/any'} />}
      onClick={() => { props.handleOnClick(id) }}
    >
      <Meta
        title={name}
      />
      <div style={{height: 60, marginTop: 10}}>
        {
          genres.map(tag => (
            <CheckableTag
              key={tag}
            >
              {tag}
            </CheckableTag>
          ))
        }
      </div>
    </Card>
  )
}

export default ShowComponent
