import React from 'react';
import Autosuggest from 'react-autosuggest';
import { withFirebase } from '../../Firebase';
import theme from './theme.css';
// import classes from '*.module.css';

let locations = [
];

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? [] : locations.filter(location =>
    location.name.toLowerCase().slice(0, inputLength) === inputValue
  );
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.name;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
  <div>
    {suggestion.name}
  </div>
);

class AutoSuggestLocations extends React.Component {
  constructor(props) {
    super(props);

    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    this.state = {
      value: this.props.location,
      suggestions: []
    };
  }

  componentDidMount() {
    this.props.firebase.locations().on('value', snapshot => {
      const locationsObject = snapshot.val();
      if (locationsObject) {
        const locationsList = Object.keys(locationsObject).map(key => ({
          name: key,
        }))
        locations = locationsList;
      }
    });
  }

  componentWillReceiveProps(props) {
    this.setState({ value: props.location });
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
    this.props.getInputData(newValue);

  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  onSuggestionSelected = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
    this.props.getSelectedData(suggestionValue);
  }


  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  componentWillUnmount() {
    this.props.firebase.locations().off();
  }


  render() {
    const { value, suggestions } = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: 'Location name',
      value,
      onChange: this.onChange
    };

    // Finally, render it!
    return (

      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionSelected={this.onSuggestionSelected}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        highlightFirstSuggestion={true}

      //styling from theme.css   
      />
    );
  }
}

export default withFirebase(AutoSuggestLocations);
