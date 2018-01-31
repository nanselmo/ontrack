import * as React from "react";

import Timeout from "shared/util/timeout";

import TextField from "shared/components/ui/fields/text-field";
import FieldValidationState from "shared/components/ui/fields/field-validation-state";
import {getTier, GetTierError} from "shared/util/get-tier";

import "./address-tier-calculator.scss";
import "./spinning-load-icon.scss";

type Geolocation = {latitude: number, longitude: number};
interface AddressInfo {
  address: string
  tier: string
  geolocation: Geolocation
}

interface AddrTierCalcProps {
  address: string | null
  tier: string | null
  geolocation: Geolocation | null
  onAddressChange: (newAddress: string) => any
  onTierChange: (newTier: string) => any
  onGeolocationChange: (newGeo: Geolocation) => any
}

interface AddrTierCalcState {
  address: string
  tier: string
  geo: Geolocation
  request?: Promise<string> 
  timeoutInstance?: Timeout | null
  requestInProgress: boolean
  addressValidationState: FieldValidationState
}

export default class AddressTierCalculator extends React.Component<AddrTierCalcProps, AddrTierCalcState> {

  constructor(props){
    super(props);
    this.state = {
      address: props.address ? props.address : "",
      tier: props.tier ? props.tier : "",
      geo: props.geolocation ? props.geolocation : {latitude: 0, longitude: 0},
      timeoutInstance: null,
      requestInProgress: false,
      addressValidationState: FieldValidationState.NEUTRAL
    };
  } 

  private now(): number {
    return new Date().valueOf();
  }

  private setRequestInProgress = (isInProgress: boolean) => {
    if (isInProgress !== this.state.requestInProgress) {
      this.setState({
        requestInProgress: isInProgress
      });
    }
  }

  private handleAddressChange = (address: string): void => {
    const TIMEOUT_DELAY = 1000; // ms

    this.setState({
      address: address,
      addressValidationState: FieldValidationState.NEUTRAL,
      tier: null
    });

    const validate = (address: string) => {
      return address && address.length > 5;
    };

    // after a timeout (to make sure that we don't send a ton of requests)
    // send a request for the tier
    const newTimeout = new Timeout( () => {

      // signal that request is in progress
      this.setRequestInProgress(true);

      // if address passes basic validation
      if (validate(address)) {
        getTier(address).then( ({tier, geo}) => {
          this.setState({
            tier: tier,
            geo: geo,
            addressValidationState: FieldValidationState.SUCCESS
          });
          this.setRequestInProgress(false);
          this.props.onAddressChange(address.trim());
          this.props.onTierChange(tier);
          this.props.onGeolocationChange(geo);

        }).catch( err => {
          if (err === GetTierError.InvalidAddressErr) {
            this.setState({
              addressValidationState: FieldValidationState.FAILURE
            });
            this.setRequestInProgress(false);
          } else if (err === GetTierError.NoTierFoundErr) {
            this.setState({
              addressValidationState: FieldValidationState.WARNING
            });
            this.setRequestInProgress(false);
          } else if (err === GetTierError.RequestFailedErr) {
            this.setState({
              addressValidationState: FieldValidationState.WARNING
            });
            this.setRequestInProgress(false);
          }
        });
      }
    }, TIMEOUT_DELAY);

    if (this.state.timeoutInstance !== null) {
      this.state.timeoutInstance.cancel();
    }

    newTimeout.start();
    this.setState({
      timeoutInstance: newTimeout 
    });
  }

  private handleTierChange(event: React.FormEvent<any>) {
    const newTier: string = event.currentTarget.value;
    this.props.onTierChange(newTier);
  }

  private displayStatusMessage(state: string): string {
    if (state === "warning") {
      return "Your address is right, but it doesn't seem to be in the Chicago Public Schools boundary. Are you sure you used the right address?"
    } else if (state === "error") {
      return "We can't find your address -- are you sure you entered it correctly?";
    } else {
      return "No errors"
    }
  }

  render() {
    return <div className="address-tier-calculator">
      <TextField
        label="Your street address"
        value={this.state.address ? this.state.address : " " }
        onChange={this.handleAddressChange}
      />
      <div className="tier-display">
        { this.state.requestInProgress 
              ? <div className="spinning-load-icon">Loading...</div>
              : (this.state.tier ? this.state.tier : "")
        }
      </div>
      { this.state.addressValidationState !== FieldValidationState.SUCCESS &&
        this.state.addressValidationState !== FieldValidationState.NEUTRAL &&
          <div className="address-status-message">
            {this.displayStatusMessage(this.state.addressValidationState)}
          </div>
      }
    </div>
  }
}
