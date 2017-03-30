var React = require('react')
var ReactDOM = require('react-dom')

var Hello = React.createClass({
	render: function() {
		return (
			<h1>
			Hello, React!
			</h1>
		)
	}
})

var data = {
  "movies": [
    {
      "abridged_cast": [
        {
          "characters": [
            "Dominic Toretto"
          ],
          "id": "162652472",
          "name": "Vin Diesel"
        },
        {
          "characters": [
            "Brian O'Conner"
          ],
          "id": "162654234",
          "name": "Paul Walker"
        }
      ],
      "runtime": 140,
      "synopsis": "Continuing the global exploits in the unstoppable franchise built on speed, Vin Diesel, Paul Walker and Dwayne Johnson lead the returning cast of Fast & Furious 7. James Wan directs this chapter of the hugely successful series that also welcomes back favorites Michelle Rodriguez, Jordana Brewster, Tyrese Gibson, Chris \"Ludacris\" Bridges, Elsa Pataky and Lucas Black. They are joined by international action stars new to the franchise including Jason Statham, Djimon Hounsou, Tony Jaa, Ronda Rousey and Kurt Russell.",
      "title": "Furious 7",
      "year": 2015
    }
  ],
  "runtime": 140
}

var DataBlock = React.createClass({
    getInitialState: function() {
      return {
        data: null
      };
    },

    componentDidMount: function() {
                this.setState({
                    data: this.props.url
                });
   },
    render: function() {
        return <div>
        <h3>runtime: {data.runtime}</h3>
        <h4>the data:</h4>
        {this.state.data}
        </div>;
    }
});

ReactDOM.render(<DataBlock url={data}/>, document.getElementById('data-stuff'))
