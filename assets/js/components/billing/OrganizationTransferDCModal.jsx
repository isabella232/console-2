import React, { Component } from 'react'
import analyticsLogger from '../../util/analyticsLogger'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import find from 'lodash/find'
import { transferDC } from '../../actions/dataCredits'
import { graphql } from 'react-apollo'
import { ALL_ORGANIZATIONS } from '../../graphql/organizations'
import numeral from 'numeral'
import { Modal, Button, Typography, Input, Select, Row, Col } from 'antd';
const { Text } = Typography
const { Option } = Select

const queryOptions = {
  options: props => ({
    fetchPolicy: 'cache-and-network',
  })
}

const styles = {
  container: {
    marginBottom: 30,
  },
  checkboxContainer: {
    marginTop: 30,
    display: 'flex',
    flexDirection: 'row'
  },
  amountContainer: {
    backgroundColor: '#E6F7FF',
    padding: 24,
    borderRadius: 8,
  },
  input: {
    marginTop: 8,
    marginBottom: 8
  },
  orgName: {
    fontSize: 18,
    color: '#38A2FF'
  },
  headerContainer: {
    marginBottom: 20,
    marginTop: -15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  rowSpaceBetween: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
}

@connect(null, mapDispatchToProps)
@graphql(ALL_ORGANIZATIONS, queryOptions)
class OrganizationTransferDCModal extends Component {
  state = {
    selectedOrgId: undefined,
    countDC: undefined,
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.open && !this.props.open) {
      this.setState({
        selectedOrgId: undefined,
        countDC: undefined,
      })
    }
  }

  handleCountInputUpdate = (e) => {
    this.setState({
      countDC: e.target.value
    })
  }

  handleSelectOrg = selectedOrgId => {
    this.setState({
      selectedOrgId
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.transferDC(this.state.countDC, this.state.selectedOrgId)

    this.props.onClose()
  }

  renderOrgEntry = () => {
    const { organization, data: { allOrganizations } } = this.props
    return (
      <div>
        {
          organization && (
            <React.Fragment>
              <div style={styles.container}>
                <div style={styles.headerContainer}>
                  <div>
                    <Text>Available DC Balance: </Text>
                  </div>
                  <Text style={{ color: '#4091F7', fontSize: 30, fontWeight: 500 }}>{numeral(organization.dc_balance).format('0,0')}</Text>
                </div>

                <div style={{
                  ...styles.amountContainer,
                  borderBottomLeftRadius: this.state.countDC && this.state.countDC > 0 ? 0 : 8,
                  borderBottomRightRadius: this.state.countDC && this.state.countDC > 0 ? 0 : 8,
                }}>
                  <Text>I'd like to send:</Text>
                  <Input
                    placeholder="Enter Quantity"
                    name="countDC"
                    value={this.state.countDC}
                    onChange={this.handleCountInputUpdate}
                    style={styles.input}
                    type="number"
                    onKeyPress={e => {
                      if (e.key == ".") e.preventDefault()
                    }}
                  />
                </div>
                {
                  this.state.countDC && this.state.countDC > 0 && (
                    <div style={{
                      ...styles.amountContainer,
                      backgroundColor: '#D3F1FF',
                      ...styles.rowSpaceBetween,
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                    }}>
                      <Text>Remaining DC Balance:</Text>
                      <Text style={{ color: '#4091F7', fontSize: 20, fontWeight: 500 }}>{numeral(organization.dc_balance - this.state.countDC).format('0,0')}</Text>
                    </div>
                  )
                }
              </div>

              <div>
                <Text strong>Which Organization should receive them?</Text>
                <div style={{ marginTop: 4 }}>
                  <Select
                    placeholder="Please choose Organization..."
                    value={this.state.selectedOrgId}
                    onChange={this.handleSelectOrg}
                    style={{ width: '100%', marginTop: 8 }}
                  >
                    {
                      allOrganizations && allOrganizations.filter(org => org.id !== organization.id).map(org => (
                        <Option value={org.id} key={org.id}>
                          {org.name}
                        </Option>
                      ))
                    }
                  </Select>
                </div>
              </div>
            </React.Fragment>
          )
        }
      </div>
    )
  }

  render() {
    const { open, onClose, organization } = this.props

    return(
      <Modal
        title="Transfer DC to Organization"
        visible={open}
        onCancel={onClose}
        centered
        footer={
          [
            <Button key="back" onClick={this.props.onClose}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={this.handleSubmit}
              disabled={!this.state.selectedOrgId || !this.state.countDC || this.state.countDC == 0}
            >
              Make Transfer
            </Button>,
          ]
        }
      >
        {this.renderOrgEntry()}
      </Modal>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ transferDC }, dispatch)
}

export default OrganizationTransferDCModal