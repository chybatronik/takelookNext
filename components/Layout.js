import Head from 'next/head'
import Router from 'next/router'
import { LocaleProvider, Layout, Input } from 'antd'
import enUS from 'antd/lib/locale-provider/en_US'

const Search = Input.Search
const { Header, Content, Footer } = Layout

export default ({ title, children, url, queryName }) =>
  <div>
    <Head>
      <title>{ title }</title>
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta charSet='utf-8' />
      <link rel='stylesheet' href='//cdnjs.cloudflare.com/ajax/libs/antd/3.2.0/antd.min.css' />
    </Head>
    <style jsx global>{`
      body {
      }
      .spiner {
        text-align: center;
        border-radius: 4px;
        margin-bottom: 20px;
        padding: 30px 50px;
        margin: 20px 0;
      }
    `}</style>
    <LocaleProvider locale={enUS}>
      <Layout>
        <Header style={{ position: 'fixed', width: '100%', zIndex: 1000 }}>
          <Search
            placeholder='Search Shows and People'
            defaultValue={queryName}
            onSearch={value => {
              console.log('value:L', value)
              if (!value || value === '') {
                // url.pushTo('/')
                // Router.prefetch('/index')
                Router.push({
                  pathname: '/'
                })
              } else {
                // url.pushTo('/search/' + value)
                // Router.prefetch('/search')
                Router.push({
                  pathname: '/search',
                  query: { name: value }
                })
              }
            }}
            enterButton
          />
        </Header>
        <Content style={{ padding: '0 50px', marginTop: 64, minHeight: '85vh' }}>
          <div style={{ margin: '16px 0', background: '#fff', padding: 24, minHeight: '80vh' }}>
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Takelook Next.js ©2018 Created by chybatronik
        </Footer>
      </Layout>
    </LocaleProvider>
  </div>
