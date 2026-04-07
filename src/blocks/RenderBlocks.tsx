import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { AboutBlockComponent } from '@/blocks/About/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { ExperienceBlockComponent } from '@/blocks/Experience/Component'
import { HeroBlockComponent } from '@/blocks/Hero/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { SkillsBlock } from './Skills/Component'

const blockComponents = {
  heroBlock: HeroBlockComponent,
  aboutBlock: AboutBlockComponent,
  content: ContentBlock,
  cta: CallToActionBlock,
  experience: ExperienceBlockComponent,
  mediaBlock: MediaBlock,
  skills: SkillsBlock,
}

// These blocks manage their own spacing/layout and should not be wrapped
const fullWidthBlocks = new Set(['heroBlock'])

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType] as React.ComponentType<any>

            if (Block) {
              return fullWidthBlocks.has(blockType) ? (
                <Block key={index} {...block} disableInnerContainer />
              ) : (
                <div className="my-16" key={index}>
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
