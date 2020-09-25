import { h, Component, render } from 'https://unpkg.com/preact?module';
import htm from 'https://unpkg.com/htm?module';

const html = htm.bind(h);

function init() {
  render(html`<${App}/>`, document.body);
}

class App extends Component {
  componentDidMount() {
    const mql = window.matchMedia("(min-width: 640px)");
    this.setState({splitView: mql.matches});
    mql.addEventListener('change', this.handleMatchMediaChange);
  }

  handleMatchMediaChange = ({matches}) => {
    this.setState({splitView: matches});
  }

  render({}, {splitView}) {
    const result = splitView ? html`<${SplitLayout}/>` : html`<${SwitchLayout}/>`;
    return result
  }
}

class SwitchLayout extends Component {
  render() {
    return html`<div class="switch-layout">
      <div class="main-pane">
        <div class="tree-pane"></div>
        <div class="data-pane"></div>
      </div>
      <div class="switch-pane"><${Switch} /></div>
    </div>`
  }
}

class SplitLayout extends Component {
  render() {
    return html`<div class="split-layout">
      <div class="tree"></div>
      <div class="data"></div>
    </div>`
  }
}

class Switch extends Component {
  render() {
    return html`<div class="switch-box">
      <${SwitchBorderImage}/>
      <div class="switch-border">
        <div class="switch">
          <div class="knob"></div>
        </div>
      </div>
    </div>`
  }
}

class SwitchBorderImage extends Component {
  render() {
    return html`<svg width="100%" height="100%" viewBox="0 0 60 35">
      <linearGradient id="linearColors1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#999"></stop>
        <stop offset="25%" stop-color="#ccc"></stop>
        <stop offset="75%" stop-color="#ccc"></stop>
        <stop offset="100%" stop-color="#999"></stop>
      </linearGradient>
      <path d="m 17.5 0 a 17.5 17.5 0 0 0 0 35 l 25 0 a 17.5 17.5 0 0 0 0 -35 l -25 0"
          fill="none" stroke="url(#linearColors1)" stroke-width="10" />
    </svg>`
  }
}

init();