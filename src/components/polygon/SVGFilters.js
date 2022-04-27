

const genDefVals = (props) => {
  const width_ = parseFloat(props.width); 

  return {
    dark0: props.dark0 ? props.dark0 : "rgba(138, 144, 150, 0.6)",
    dark1: props.dark1 ? props.dark1 : "rgba(161,168,175, 0.5)",
    dark2: props.dark2 ? props.dark2 : "rgba(184,192,200, 0.5)",
    dark3: props.dark3 ? props.dark3 : "rgba(207,216,225, 0.5)",
    light0: props.light0 ? props.light0 : "rgba(220,209,240, 0.5)",
    light1: props.light1 ? props.light1 : "rgba(232,224,245,0.5)",
    light2: props.light2 ? props.light2 : "rgba(243,239,250,0.5)",
    light3: props.light3 ? props.light3 : "rgba(250,252,254,0.8)",
    element: props.element ? props.element : "rgba(255,255,255, 0.5)",
    d0blur: {std: (6 * width_) / 440, dx: (12 * width_) / 440, dy: (5 * width_) / 440},
    d1blur: {std: (6 * width_) / 440, dx: (4.5 * width_) / 440, dy: (4.5 * width_) / 440},
    d2blur: {std: (3.5 * width_) / 440, dx: (3.5 * width_) / 440, dy: (3.5 * width_) / 440},
    d3blur: {std: (0.5 * width_) / 440, dx: (1.5 * width_) / 440, dy: (1.5 * width_) / 440},
    l0blur: {std: (1 * width_) / 440, dx: (-1.5 * width_) / 440, dy: (-1.5 * width_) / 440},
    l1blur: {std: (6 * width_) / 440, dx: (-4.5 * width_) / 440, dy: (-4.5 * width_) / 440},
    l2blur: {std: (6 * width_) / 440, dx: (-12 * width_) / 440, dy: (-5 * width_) / 440},
    l3blur: {std: (0.5 * width_) / 440, dx: (-0.5 * width_) / 440, dy: (-0.5 * width_) / 440},
    l4blur: {std: (0.5 * width_) / 440, dx: (0.5 * width_) / 440, dy: (0.5 * width_) / 440},
    elblur: {std: (2.5 * width_) / 440, dx: 0, dy: 0},
  }
}

const genDefValsRect = (props) => {
  const width_ = parseFloat(props.width); 

  return {
    dark0: props.dark0 ? props.dark0 : "rgba(65,58,75, 0.1)",
    dark1: props.dark1 ? props.dark1 : "rgba(161,168,175, 0.5)",
    dark2: props.dark2 ? props.dark2 : "rgba(184,192,200, 0.5)",
    dark3: props.dark3 ? props.dark3 : "rgba(207,216,225, 0.5)",
    light0: props.light0 ? props.light0 : "rgba(207,216,225, 0.5)",
    light1: props.light1 ? props.light1 : "rgba(232,224,245,0.5)",
    light2: props.light2 ? props.light2 : "rgba(243,239,250,0.5)",
    light3: props.light3 ? props.light3 : "rgba(250,252,254,0.8)",
    element: props.element ? props.element : "rgba(255,255,255, 0.5)",
    d0blur: {std: (1 * width_) / 440, dx: (1 * width_) / 440, dy: (1 * width_) / 440},
    d1blur: {std: (5 * width_) / 440, dx: (3 * width_) / 440, dy: (3 * width_) / 440},
    d2blur: {std: (6 * width_) / 440, dx: (4 * width_) / 440, dy: (4 * width_) / 440},
    d3blur: {std: (1 * width_) / 440, dx: (1 * width_) / 440, dy: (1 * width_) / 440},
    l0blur: {std: (10 * width_) / 440, dx: (-4 * width_) / 440, dy: (-4 * width_) / 440},
    l1blur: {std: (2 * width_) / 440, dx: (-1 * width_) / 440, dy: (-1 * width_) / 440},
    l2blur: {std: (5 * width_) / 440, dx: (-3 * width_) / 440, dy: (-3 * width_) / 440},
    l3blur: {std: (1 * width_) / 440, dx: (-1 * width_) / 440, dy: (-1 * width_) / 440},
    l4blur: {std: (1 * width_) / 440, dx: (1 * width_) / 440, dy: (1 * width_) / 440},
    elblur: {std: (3 * width_) / 440, dx: 0, dy: 0},
  }
}

export const ContainerFilterRect = (props) => { 

  const _ = genDefValsRect(props);

  return (
    <filter id={props.filterId}>
      <feGaussianBlur in="SourceAlpha" stdDeviation={1} />
        <feOffset dx={1} dy={1} result="dark01"/>
        <feFlood flood-color={_.dark0}/>
        <feComposite in2="dark01" operator="in" result="dark01"/>

        <feGaussianBlur in="SourceAlpha" stdDeviation={4}/>
        <feOffset dx={2} dy={0} result="dark0"/>
        <feFlood flood-color={"rgba(65,58,75, 0.1)"}/>
        <feComposite in2="dark0" operator="in" result="dark0"/>
        <feMerge>
            <feMergeNode in="dark0"/>
            <feMergeNode in="dark1"/>
            <feMergeNode in="sourceGraphic"/>
      </feMerge>
    </filter>
  )
}

export const ContainerFilterGreen = (props) => { 

  const _ = genDefVals(props);

  return (
    <filter id={props.filterId}>

  <feGaussianBlur in="SourceAlpha" stdDeviation={_.d0blur.std} />
    <feOffset dx={_.d0blur.dx} dy={_.d0blur.dy} result="dark2"/>
    <feFlood floodColor={_.dark3}/>
    <feComposite in2="dark2" operator="in" result="dark2"/> 

    <feGaussianBlur in="SourceAlpha" stdDeviation={_.d0blur.std} />
    <feOffset dx={_.d0blur.dx} dy={_.d0blur.dy} result="dark2"/>
    <feFlood flood-color={_.dark3}/>
    <feComposite in2="dark2" operator="in" result="dark2"/> 

     <feGaussianBlur in="SourceAlpha" stdDeviation={_.d1blur.std} />
    <feOffset dx={_.d1blur.dx} dy={_.d1blur.dy} result="dark1"/>
    <feFlood flood-color={_.dark2}/>
    <feComposite in2="dark1" operator="in" result="dark1"/> 

    <feGaussianBlur in="SourceAlpha" stdDeviation={_.d2blur.std}/>
    <feOffset dx={_.d2blur.dx} dy={_.d2blur.dy} result="dark0"/>
    <feFlood flood-color={_.dark1}/>
    <feComposite in2="dark0" operator="in" result="dark0"/>

    <feGaussianBlur in="SourceAlpha" stdDeviation={_.d3blur.std} />
    <feOffset dx={_.d3blur.dx} dy={_.d3blur.dy} result="dark01"/>
    <feFlood flood-color={_.dark0}/>
    <feComposite in2="dark01" operator="in" result="dark01"/>

    <feGaussianBlur in="SourceAlpha" stdDeviation={_.l0blur.std} />
    <feOffset dx={_.l0blur.dx} dy={_.l0blur.dy} result="light0"/>
    <feFlood flood-color={_.light0}/>
    <feComposite in2="light0" operator="in" result="light0"/>

    <feGaussianBlur in="SourceAlpha" stdDeviation={_.l1blur.std} />
    <feOffset dx={_.l1blur.dx} dy={_.l1blur.dy} result="light1"/>
    <feFlood flood-color={_.light1}/>
    <feComposite in2="light1" operator="in" result="light1"/> 

    <feGaussianBlur in="SourceAlpha" stdDeviation={_.l2blur.std} />
    <feOffset dx={_.l2blur.dx} dy={_.l2blur.dy} result="light2"/>
    <feFlood flood-color={_.light2}/>
    <feComposite in2="light2" operator="in" result="light2"/>

    <feGaussianBlur in="SourceAlpha" stdDeviation={_.l3blur.std} />
    <feOffset dx={_.l3blur.dx} dy={_.l3blur.dy} result="light3"/>
    <feFlood flood-color={_.light3}/>
    <feComposite in2="light3" operator="in" result="light3"/>

    <feGaussianBlur in="SourceAlpha" stdDeviation={_.l4blur.std} />
    <feOffset dx={_.l4blur.dx} dy={_.l4blur.dy} result="light3"/>
    <feFlood flood-color={_.light3}/>
    <feComposite in2="light3" operator="in" result="light3"/>

    <feMerge>
    <feMergeNode in="dark2"/>
    <feMergeNode in="dark01"/>
    <feMergeNode in="dark1"/>
 
    <feMergeNode in="dark0"/>
    <feMergeNode in="dark2"/>
    <feMergeNode in="dark2"/>
    <feMergeNode in="light0"/>
    <feMergeNode in="light1"/>
    <feMergeNode in="light2"/>
    <feMergeNode in="light3"/> 

      </feMerge>
      
    </filter>
  )
}

export const ContainerFilter = (props) => {

  const dark = "rgba(138, 144, 150, 0.6)";
  const dark0 = "rgba(161,168,175, 0.5)";
  const dark1 = "rgba(184,192,200, 0.5)";
  const dark2 = "rgba(207,216,225, 0.5)";
  const light0 = "rgba(220,209,240, 0.5)";
  const light1 = "rgba(232,224,245,0.5)";
  const light2 = "rgba(243,239,250,0.5)";
  const element = props.element;

  const _ = genDefVals(props);
  return (
        <filter id={props.filterId}>

        <feGaussianBlur in="SourceAlpha" stdDeviation={_.d0blur.std} />
        <feOffset dx={_.d0blur.dx} dy={_.d0blur.dy} result="dark2"/>
        <feFlood flood-color={_.dark3}/>
        <feComposite in2="dark2" operator="in" result="dark2"/> 

         <feGaussianBlur in="SourceAlpha" stdDeviation={_.d1blur.std} />
        <feOffset dx={_.d1blur.dx} dy={_.d1blur.dy} result="dark1"/>
        <feFlood flood-color={_.dark2}/>
        <feComposite in2="dark1" operator="in" result="dark1"/> 

        <feGaussianBlur in="SourceAlpha" stdDeviation={_.d2blur.std}/>
        <feOffset dx={_.d2blur.dx} dy={_.d2blur.dy} result="dark0"/>
        <feFlood flood-color={_.dark1}/>
        <feComposite in2="dark0" operator="in" result="dark0"/>

        <feGaussianBlur in="SourceAlpha" stdDeviation={_.d3blur.std} />
        <feOffset dx={_.d3blur.dx} dy={_.d3blur.dy} result="dark01"/>
        <feFlood flood-color={_.dark0}/>
        <feComposite in2="dark01" operator="in" result="dark01"/>

        <feGaussianBlur in="SourceAlpha" stdDeviation={_.l0blur.std} />
        <feOffset dx={_.l0blur.dx} dy={_.l0blur.dy} result="light0"/>
        <feFlood flood-color={_.light0}/>
        <feComposite in2="light0" operator="in" result="light0"/>

        <feGaussianBlur in="SourceAlpha" stdDeviation={_.l1blur.std} />
        <feOffset dx={_.l1blur.dx} dy={_.l1blur.dy} result="light1"/>
        <feFlood flood-color={_.light1}/>
        <feComposite in2="light1" operator="in" result="light1"/> 

        <feGaussianBlur in="SourceAlpha" stdDeviation={_.l2blur.std} />
        <feOffset dx={_.l2blur.dx} dy={_.l2blur.dy} result="light2"/>
        <feFlood flood-color={_.light2}/>
        <feComposite in2="light2" operator="in" result="light2"/>

        <feGaussianBlur in="SourceAlpha" stdDeviation={_.l3blur.std} />
        <feOffset dx={_.l3blur.dx} dy={_.l3blur.dy} result="light3"/>
        <feFlood flood-color={_.light3}/>
        <feComposite in2="light3" operator="in" result="light3"/>

        <feGaussianBlur in="SourceAlpha" stdDeviation={_.l4blur.std} />
        <feOffset dx={_.l4blur.dx} dy={_.l4blur.dy} result="light3"/>
        <feFlood flood-color={_.light3}/>
        <feComposite in2="light3" operator="in" result="light3"/>

        <feMerge>
            <feMergeNode in="dark"/>
            <feMergeNode in="dark01"/>
            <feMergeNode in="dark0"/>
            <feMergeNode in="dark1"/>
            <feMergeNode in="dark2"/>
            <feMergeNode in="light0"/>
            <feMergeNode in="light1"/>
            <feMergeNode in="light2"/>
            <feMergeNode in="light3"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
          
        </filter>
  
  )
}

export const TextFilter = (props) => {

  const dark0 = props.dark0 ? props.dark0 : "#494c50";
  const dark = props.dark ? props.dark : "#2e3032";
  const light = props.light ? props.light : "rgba(255,255,255, 0.6)"
    
    
  return (
    <filter id={props.filterId}>
    <feGaussianBlur in="SourceAlpha" stdDeviation={3} />
        <feOffset dx={3} dy={3} result="light"/>
        <feFlood flood-color={light}/>
        <feComposite in2="light" operator="in" result="light"/> 

        <feGaussianBlur in="SourceAlpha" stdDeviation={1} />
        <feOffset dx={0} dy={0} result="dark"/>
        <feFlood flood-color={dark}/>
        <feComposite in2="dark" operator="in" result="dark"/> 

        <feGaussianBlur in="SourceAlpha" stdDeviation={4} />
        <feOffset dx={3} dy={3} result="light"/>
        <feFlood flood-color={light}/>
        <feComposite in2="light" operator="in" result="light"/> 

        <feGaussianBlur in="SourceAlpha" stdDeviation={0} />
        <feOffset dx={0} dy={0} result="dark0"/>
        <feFlood flood-color={dark0}/>
        <feComposite in2="dark0" operator="in" result="dark0"/> 
        <feMerge>
            <feMergeNode in="dark"/>
            <feMergeNode in="dark0"/>
            <feMergeNode in="light"/>
            <feMergeNode in="SourceGraphic"/>
        </feMerge>
        </filter> 
  )
}

export const LogoFilter = (props) => {
  return (
    <filter id={props.filterId}>
    <feGaussianBlur in="SourceAlpha" stdDeviation={3} />
        <feOffset dx={3} dy={3} result="light"/>
        <feFlood flood-color={"rgba(255,255,255, 0.6"}/>
        <feComposite in2="light" operator="in" result="light"/> 
        <feMerge>
            <feMergeNode in="dark"/>
            <feMergeNode in="dark01"/>
            <feMergeNode in="light"/>
            <feMergeNode in="SourceGraphic"/>
        </feMerge>
        </filter> 
  )
}

export const EthLogoFilter = (props) => {
  return (
    <filter id={props.filterId}>
    <feGaussianBlur in="SourceAlpha" stdDeviation={3} />
        <feOffset dx={3} dy={3} result="light"/>
        <feFlood flood-color={"rgba(255,255,255, 0.6"}/>
        <feComposite in2="light" operator="in" result="light"/> 

        <feGaussianBlur in="SourceAlpha" stdDeviation={10} />
        <feOffset dx={3} dy={3} result="light"/>
        <feFlood flood-color={"rgba(255,255,255, 1"}/>
        <feComposite in2="light" operator="in" result="light"/> 

        <feGaussianBlur in="SourceAlpha" stdDeviation={8} />
        <feOffset dx={0} dy={0} result="dark"/>
        <feFlood flood-color={"#2e3032"}/>
        <feComposite in2="dark" operator="in" result="dark"/> 

        <feGaussianBlur in="SourceAlpha" stdDeviation={15} />
        <feOffset dx={0} dy={0} result="dark01"/>
        <feFlood flood-color={"#494c50"}/>
        <feComposite in2="dark01" operator="in" result="dark01"/>

        <feMerge>
            <feMergeNode in="dark"/>
            <feMergeNode in="dark01"/>
            <feMergeNode in="light"/>
            <feMergeNode in="SourceGraphic"/>
        </feMerge>
        </filter> 
  )
}
