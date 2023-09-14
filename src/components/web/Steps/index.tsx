import React, { Fragment } from "react";
import { Box } from "@chakra-ui/react"
import ArrowLeftIcon from "@src/components/Icons/ArrowLeft";

export default function Steps({ count, backgroundColor, foregroundColor, activeIndex, onStepChange, showBackButton, ...extraProps }: any) {
  return (
    <Box
      width="100%"
      height="28px"
      display="flex"
      alignItems="center"
      {...extraProps}
    >
      {showBackButton && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="24px"
          height="24px"
          cursor="pointer"
          onClick={(onStepChange && activeIndex > 0) ? () => onStepChange(activeIndex - 1) : () => {}}
        >
          <ArrowLeftIcon />
        </Box>
      )}
      {Array(count - 1).fill('').map((item: any, i: number) => {
        return (
          <Fragment>
            <Box
              width="24px"
              height="24px"
              border={`2px solid ${backgroundColor}`}
              borderRadius="24px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontFamily="Martian"
              fontSize="12px"
              boxSizing="border-box"
              cursor={(onStepChange && i < activeIndex) ? 'pointer' : 'inherit'}
              background={i <= activeIndex ? backgroundColor : ''}
              color={i <= activeIndex ? foregroundColor : backgroundColor}
              onClick={(onStepChange && i < activeIndex) ? () => onStepChange(i) : () => {}}
            >
              {i + 1}
            </Box>
            <Box
              width="24px"
              height="24px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxSizing="border-box"
            >
              <Box width="20px" height="2px" background={backgroundColor} />
            </Box>
          </Fragment>
        )
      })}
      <Box
        width="24px"
        height="24px"
        border={`2px solid ${backgroundColor}`}
        borderRadius="24px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontFamily="Martian"
        fontSize="12px"
        boxSizing="border-box"
        background={(count === activeIndex + 1) ? backgroundColor : ''}
        color={(count === activeIndex + 1) ? foregroundColor : backgroundColor}
      >
        {count}
      </Box>
    </Box>
  )
}
