// Import React
import React from "react";

// Import Spectacle Core tags
import {
  Appear,
  CodePane,
  Deck,
  Heading,
  ListItem,
  List,
  Slide,
  Text,
  Image
} from "spectacle";

// Import theme
import createTheme from "spectacle/lib/themes/default";

// Require CSS
import styles from "./styles.module.css";
require("normalize.css");

const theme = createTheme(
  {
    primary: "white",
    secondary: "#1F2022",
    tertiary: "#03A9FC",
    quaternary: "#CECECE"
  },
  {
    primary: "Montserrat",
    secondary: "Helvetica"
  }
);

const kernelCodeCompressed = `
  void kernel() {
    float user_accumulator=0.0;
    
    for (int user_i=1; user_i<=5000; user_i++) {
      user_accumulator
        += get(user_input, threadId.x) + 1.0 / float(user_i);
    }

    kernelResult = user_accumulator;
    return;
  }
`;

const run = `
  gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
`;

const readTexture = `
  readFloatPixelsToFloat32Array() {
    const texSize = this.texSize,
          gl = this.context;
    const w = texSize[0];
    const h = texSize[1];
    const result = new Float32Array(w * h * 4);
    gl.readPixels(0, 0, w, h, gl.RGBA, gl.FLOAT, result);
    return result;
  }
`;

const jsLoop = `
  for(let i=1; i<=5000; i++) {
    let accumulator = 0;
    for (let j = 1; j<=5000; j++) {
      accumulator += j / i;
    }
    output[i] = accumulator;
  }
`;

const gpuLoop = `
  gpuMultiply(input: Number[]) {
    let accumulator = 0;
    for (let i = 1; i <= 5000; i++) {
      accumulator += (input[this.thread.x] + 1) / i;
    }
    return accumulator;
  };
`;

const gpuLoopAnnotated = `
  ${gpuLoop}
  // Then use this as the input:
  const input = new Array(5000).fill(0).map(() => Math.random());
`;

const CodeTemplate = ({ title, src }) => (
  <Slide>
    <Heading size={2} caps lineHeight={1} textColor="secondary">
      {title}
    </Heading>
    <CodePane className={styles.code} lang="js" source={src} />
  </Slide>
);

const CodeWithImage = ({ title, src, img }) => (
  <Slide>
    <Heading size={2} caps lineHeight={1} textColor="secondary">
      {title}
    </Heading>
    <CodePane className={styles.code} lang="js" source={src} />
    <Image src={img}></Image>
  </Slide>
);

const CodeComparison = ({ title, srcs }) => (
  <>
    <Heading size={2} caps lineHeight={1} textColor="secondary">
      {title}
    </Heading>
    {srcs.map(([label, src], order) => (
      <Appear key={order} order={order}>
        <div className={styles.multicodeWrapper}>
          <Heading size={6} caps lineHeight={1} textColor="secondary">
            {label}
          </Heading>
          <CodePane className={styles.code} lang="js" source={src} />
        </div>
      </Appear>
    ))}
  </>
);

const TitlePage = () => (
  <Slide transition={["zoom"]} bgColor="primary">
    <Heading size={3} lineHeight={1} textColor="secondary">
      Unlocking the supercomputer in your browser
    </Heading>
    <Text margin="10px 0 0" textColor="tertiary" size={1} fit bold>
      General-purpose GPU computing with GPU.js
    </Text>
  </Slide>
);

const Demo = () => (
  <Slide>
    <iframe
      className={styles.demo}
      title="demo"
      src="https://lukeolney.me/javascript-gpgpu-demo/"
    ></iframe>
  </Slide>
);

const ShaderToy = ({ title, text, src }) => (
  <Slide className={styles.shaderToy}>
    <Heading size={2} caps lineHeight={1} textColor="secondary">
      {title}
    </Heading>
    {text && (
      <Text margin="10px 0 0" textColor="tertiary" size={1} bold>
        {text}
      </Text>
    )}
    <iframe
      width="100%"
      height="100%"
      frameBorder="0"
      src={src}
      title={title}
      allowfullscreen
    ></iframe>
  </Slide>
);

const Applications = () => (
  <Slide>
    <Heading size={1} fit caps lineHeight={1} textColor="secondary">
      Applications
    </Heading>
    <Text textColor="tertiary">GPU.js is a hackathon project</Text>
    <List>
      <ListItem>TensorFlow.js? uses their own backend</ListItem>
      <ListItem>OpenCV? same thing</ListItem>
    </List>
  </Slide>
);

const Piano = () => (
  <Slide>
    <iframe
      className={styles.demo}
      title="demo"
      src="https://magenta.tensorflow.org/demos/performance_rnn/index.html#3|2,0,1,0,1,1,0,1,0,1,0,1|1,1,1,1,1,1,1,1,1,1,1,1|1,1,1,1,1,1,1,1,1,1,1,1|false"
    ></iframe>
  </Slide>
);

export default class Presentation extends React.Component {
  render() {
    return (
      <Deck
        transition={["slide"]}
        transitionDuration={500}
        progress="bar"
        theme={theme}
      >
        <TitlePage />
        <CodeTemplate title="Some code" src={jsLoop} />
        <Demo />
        <Slide>
          <CodeComparison
            title="Code"
            srcs={[
              ["Vanilla Javascript", jsLoop],
              ["Uses the GPU", gpuLoopAnnotated]
            ]}
          />
        </Slide>
        <ShaderToy
          title="How's it done?"
          text="Raw WebGL"
          src="https://www.shadertoy.com/embed/ld2Gz3?gui=true&t=10&paused=false&muted=false"
        />
        <Slide>
          <Heading size={1} fit caps lineHeight={1} textColor="secondary">
            Pipeline
          </Heading>
          <Text>
            Compile shader -> load data as texture -> draw -> read texture as
            data
          </Text>
          <Image src="pipeline-diagram.001.png"></Image>
        </Slide>
        <CodeWithImage
          title={'"Draw" your data'}
          src={run}
          img={"drawing.png"}
        />
        <Slide>
          <CodeComparison
            title="Compiled shader"
            srcs={[
              ["Orginal", gpuLoop],
              ["Compiled (minus boilerplate)", kernelCodeCompressed]
            ]}
          />
        </Slide>
        <CodeWithImage
          title="Read the output texture"
          src={readTexture}
          img={"output.png"}
        />
        <Applications />
        <Piano />
        <ShaderToy
          title="fin"
          text="Questions?"
          src="https://www.shadertoy.com/embed/XsX3RB?gui=true&t=10&paused=false&muted=false"
        />
      </Deck>
    );
  }
}
