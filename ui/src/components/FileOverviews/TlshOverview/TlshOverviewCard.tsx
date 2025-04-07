import { Tag, Typography } from 'antd'
import { antdColors } from '../../../utils/colors'
import '../../../styles/TlshOverviewCard.css'
import type { CSSProperties } from 'react'
import type { OverviewCardProps } from '../types'

const { Text } = Typography

interface TlshCustomCss extends CSSProperties {
  '--box-glow-color': string
}

const TlshOverviewCard = (props: OverviewCardProps) => {
  const { data } = props
  const { match } = data.scan.tlsh
  const score = match.score
  const family = match.family
  const matchedTlsh = match.tlsh

  // Define the indexes where we want to show the scores
  const scorePositions = {
    0: ['0', 'Very Similar'],
    6: ['75', 'Somewhat Similar'],
    14: ['150', 'Moderately Different'],
    22: ['225', 'Quite Different'],
    29: ['300+', 'Very Different'],
  }

  // Logic to determine the similarity description based on the score
  const getSimilarityDescription = (score) => {
    if (score < 30) return 'Very Similar'
    if (score < 75) return 'Somewhat Similar'
    if (score < 150) return 'Moderately Different'
    if (score < 225) return 'Quite Different'
    return 'Very Different' // Assuming scores higher than 225 are 'Very Different'
  }

  // Function to get color based on similarity description
  const getColorForDescription = (description) => {
    const colorMapping = {
      'Very Similar': 'red',
      'Somewhat Similar': 'volcano',
      'Moderately Different': 'orange',
      'Quite Different': 'gold',
      'Very Different': 'lime',
    }
    return colorMapping[description] || antdColors.gray
  }

  // Construct the sentence with the provided values
  const tlshDescriptionSentence = (
    <Text style={{ fontSize: '11px' }}>
      This file has a TLSH match against the family{' '}
      <Text style={{ fontSize: '11px' }} code copyable>
        {family}
      </Text>{' '}
      with the TLSH{' '}
      <Text style={{ fontSize: '11px' }} code copyable>
        {matchedTlsh}
      </Text>
      <br />
      The TLSH for this file was given a comparison score of{' '}
      <Tag
        style={{ fontSize: '11px' }}
        color={getColorForDescription(getSimilarityDescription(score))}
      >
        {score}
      </Tag>
      which indicates the two files may be{' '}
      <Tag
        style={{ fontSize: '11px' }}
        color={getColorForDescription(getSimilarityDescription(score))}
      >
        {getSimilarityDescription(score)}
      </Tag>
      <br />
      <div style={{ paddingTop: '20px' }}>
        <Text style={{ fontSize: '11px' }} type="secondary">
          The results provided are an estimation of similarity and may not be
          completely accurate. The accuracy of the TLSH comparison can vary
          significantly between different types of files, typically providing
          more reliable results for executable files than for text files.
        </Text>
      </div>
    </Text>
  )

  // antd color gradient
  const colorGradient = [
    antdColors.red, // Very Similar
    antdColors.volcano,
    antdColors.orange,
    antdColors.gold,
    antdColors.lime,
    antdColors.green, // Very Different
  ]

  // Assume 300 is the highest score for TLSH comparison (It's not, but let's pretend)
  const maxScore = 300
  // Divide the slider into 'n' parts
  const numberOfParts = 30

  // Calculate the appropriate index for the actual score to be displayed
  const scoreIndex =
    score >= maxScore
      ? numberOfParts - 1
      : Math.floor((score / maxScore) * numberOfParts)
  // Define the keys where we want to show the scores
  const scoreKeys = Object.keys(scorePositions).map(Number)

  // Update the color gradient logic to handle scores of 300 or higher
  const getColorForIndex = (index) => {
    if (index === numberOfParts - 1 && score >= maxScore) {
      return antdColors.green
    }

    return index <= scoreIndex
      ? colorGradient[
          Math.floor((colorGradient.length - 1) * (index / (numberOfParts - 1)))
        ]
      : antdColors.lightGray
  }

  return (
    <div className="tlsh-overview-card">
      <div style={{ textAlign: 'center' }}>
        <Text strong className="score-heading">
          TLSH Comparison Scale
        </Text>
        <Text style={{ fontSize: '10px' }}>(Lower = More Similar)</Text>
      </div>
      <div
        className="slider-boxes"
        style={{ paddingLeft: '15px', paddingRight: '15px' }}
      >
        {Array.from({ length: numberOfParts }).map((_, index) => {
          const isActive = index <= scoreIndex
          const backgroundColor = getColorForIndex(index)
          const boxClass = `slider-box ${isActive ? 'active' : ''} ${
            index === scoreIndex ? 'score-box' : ''
          }`

          return (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: TODO: Fix this
              key={index}
              className={boxClass}
              style={
                {
                  backgroundColor,
                  '--box-glow-color': isActive
                    ? backgroundColor
                    : 'transparent',
                } as TlshCustomCss
              }
            >
              {/* Render the actual score inside the box where it resides */}
              {index === scoreIndex && (
                <Text className="score-text">{score}</Text>
              )}
              {/* Render the tick values underneath the box its aligned to */}
              {scoreKeys.includes(index) && (
                <div className="tick-text">
                  <span>{scorePositions[index][0]}</span>
                  <br />
                  <span>{scorePositions[index][1]}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
      <div style={{ textAlign: 'center', paddingTop: '60px' }}>
        <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
          {tlshDescriptionSentence}
        </div>
      </div>
    </div>
  )
}

export default TlshOverviewCard
