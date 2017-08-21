import * as React from "react";

import Timeout from "shared/util/timeout";
import TextField from "shared/components/ui/text-field";

import "./address-tier-calculator.scss";

interface AddressInfo {
  address: string
  tier: string
}

interface AddrTierCalcProps {
  addressLabel: string
  tierLabel: string
  address: string | null
  tier: string | null
  onChange: (newAddress: string, newTier: string) => any
}

interface AddrTierCalcState {
  request?: Promise<string> 
  address: string | null
  tier: string | null
  timeoutInstance?: Timeout | null,
}

export default class AddressTierCalculator extends React.Component<AddrTierCalcProps, AddrTierCalcState> {

  componentDidUpdate() {
    this.props.onChange(this.state.address, this.state.tier);
  }

  constructor(props){
    super(props);
    this.state = {
      address: props.address,
      tier: props.tier,
      timeoutInstance: null,
    };
  } 

  private now(): number {
    return new Date().valueOf();
  }

  private handleAddressChange(event: React.ChangeEvent<any>): void {
    const address: string = event.target.value;
    const TIMEOUT_DELAY = 1500; // ms

    // if address passes very basic address validation
    // TODO: implement
    const newTimeout: Timeout = new Timeout( () => {
      // send it to the API for requestin'. Return the promise.
      // TODO: implement
      console.log(address);
    }, TIMEOUT_DELAY);

    if (this.state.timeoutInstance !== null) {
      this.state.timeoutInstance.cancel();
    }

    newTimeout.start();
    this.setState({
      address: address,
      timeoutInstance: newTimeout 
    });
  }

  private handleTierChange(event: React.ChangeEvent<any>) {
    const tier: string = event.target.value;
    this.setState({
      tier: tier
    });
  }

  render() {
    return (
      <div className="address-tier-calculator">
        <TextField
          size="lg" 
          editable={true} 
          label={this.props.addressLabel}
          onChange={this.handleAddressChange.bind(this)}
          value={this.state.address}/>

          
        <TextField 
          size="sm"
          editable={false} 
          label={this.props.tierLabel} 
          onChange={this.handleTierChange.bind(this)}
          value={this.state.tier}/>
      </div>
    )
  }
}
