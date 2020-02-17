import React, { Component } from 'react'
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';
import find from 'lodash/find'
import moment from 'moment'
import get from 'lodash/get'
import LabelTag from '../common/LabelTag'
import { PAGINATED_LABELS, LABEL_SUBSCRIPTION } from '../../graphql/labels'
import { Card, Button, Typography, Table, Pagination } from 'antd';
const { Text } = Typography

const defaultVariables = {
  page: 1,
  pageSize: 10
}

class LabelIndexTable extends Component {
  render() {
    const columns = [
      {
        title: 'Labels',
        dataIndex: 'name',
        render: (text, record) => (
          <React.Fragment>
            <Text>{text}</Text><LabelTag text={text} color={record.color} style={{ marginLeft: 10 }} />
          </React.Fragment>
        )
      },
      {
        title: 'No. of Devices',
        dataIndex: 'devices',
        render: (text, record) => <Text>{record.devices.length}</Text>
      },
      {
        title: 'Date Activated',
        dataIndex: 'inserted_at',
        render: data => moment.utc(data).local().format('lll')
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <div>
            <Link to="#" onClick={() => this.props.openDeleteLabelModal(record.id)}>Delete</Link>
            <Text>{" | "}</Text>
            <Link to={`/labels/${record.id}`}>Show</Link>
          </div>
        )
      },
    ]

    return (
      <Query query={PAGINATED_LABELS} fetchPolicy={'cache-and-network'} variables={defaultVariables}>
        {({ loading, error, data, fetchMore, subscribeToMore, variables }) => (
          <QueryResults
            loading={loading}
            error={error}
            columns={columns}
            data={data}
            fetchMore={fetchMore}
            subscribeToMore={subscribeToMore}
            subscription={LABEL_SUBSCRIPTION}
            variables={variables}
            {...this.props}
          />
        )}
      </Query>
    )
  }
}

class QueryResults extends Component {
  constructor(props) {
    super(props)

    this.state = {
      page: 1,
      pageSize: get(props, ['variables', 'pageSize']) || 10
    }

    this.handleChangePage = this.handleChangePage.bind(this)
    this.refetchPaginatedEntries = this.refetchPaginatedEntries.bind(this)
    this.handleSubscriptionAdded = this.handleSubscriptionAdded.bind(this)
  }

  componentDidMount() {
    const { subscribeToMore, subscription, fetchMore, variables } = this.props

    subscription && subscribeToMore({
      document: subscription,
      variables,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        this.handleSubscriptionAdded()
      }
    })
  }

  handleSubscriptionAdded() {
    const { page, pageSize } = this.state
    this.refetchPaginatedEntries(page, pageSize)
  }

  handleChangePage(page) {
    this.setState({ page })

    const { pageSize } = this.state
    this.refetchPaginatedEntries(page, pageSize)
  }

  refetchPaginatedEntries(page, pageSize) {
    const { fetchMore } = this.props
    fetchMore({
      variables: { page, pageSize },
      updateQuery: (prev, { fetchMoreResult }) => fetchMoreResult
    })
  }

  render() {
    const { loading, error, data, columns } = this.props

    if (loading) return null;
    if (error) return (
      <Text>Data failed to load, please reload the page and try again</Text>
    )

    const results = find(data, d => d.entries !== undefined)

    return (
      <Card
        bodyStyle={{ padding: 0, paddingTop: 1 }}
        title={`${results.entries.length} Labels`}
        extra={
          <Button
            type="primary"
            size="large"
            icon="tag"
            onClick={this.props.openCreateLabelModal}
          >
            Create New Label
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={results.entries}
          rowKey={record => record.id}
          pagination={false}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: 0}}>
          <Pagination
            current={results.pageNumber}
            pageSize={results.pageSize}
            total={results.totalEntries}
            onChange={page => this.handleChangePage(page)}
            style={{marginBottom: 20}}
          />
        </div>
      </Card>
    )
  }
}

export default LabelIndexTable