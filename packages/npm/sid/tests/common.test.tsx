import * as React from 'react'
import { render } from '@testing-library/react'

import 'jest-canvas-mock'

import { SIDButton } from '../src'

describe('Common render', () => {
  it('renders without crashing', () => {
    render(<SIDButton />)
  })
})
