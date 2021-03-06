// @flow
import styled, { css } from "styled-components";

type Props = { required: ?boolean };

// CSS written with the power of javascript using styled components
const Label = styled.label`
  font-family: inherit;
  font-weight: 600;

  + input {
    margin-top: 0;
  }

  ${(props: Props) =>
    !!props.required &&
    css`
    ::after {
      content: '*';
      margin: 0 0.1em;
      color: hsl(343,88%,53%);
    }
  `}
`;

export default Label;
