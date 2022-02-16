import { useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import { formatEther } from 'ethers/lib/utils'
import { simpleRpcProvider } from 'utils/providers'

import { useLotteryContract } from 'hooks/useContract'

export const useGetBnbBalance = (account) => {
  const [balance, setBalance] = useState(ethers.BigNumber.from(0))

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const walletBalance = await simpleRpcProvider.getBalance(account)
        setBalance(walletBalance)
      } catch(e) {
        console.error('Failed to setTokenPrice', e)
      }
    }

    if (account) {
      fetchBalance()
    }
  }, [setBalance, account])

  return balance
}

export const useSetNMDTokenprice = () => {
  const lotteryContract = useLotteryContract()

  const handleSetNMDTokenprice = useCallback(
    async ( tokenprice : number) => {
      try {
        await lotteryContract.setTokenPrice(tokenprice)
      } catch(e)
      {
        console.error('Failed to setTokenPrice', e)
      }
    },
    [lotteryContract],
  )

  return { onSetNMDTokenprice: handleSetNMDTokenprice }
}

export const useGetNMDTokenprice = () => {
  const lotteryContract = useLotteryContract()

  const handleGetNMDTokenprice = useCallback(
    async () => {
      try {
        const tokenAmountPerBNB = await lotteryContract.getLotteryCycle()
        return parseInt(tokenAmountPerBNB)
      } catch(e)
      {
        console.error('Failed to setTokenPrice', e)
        return NaN;
      }
    },
    [lotteryContract],
  )

  return { onGetNMDTokenprice: handleGetNMDTokenprice }
}

export const useGetTotalTokenSold = () => {
  const lotteryContract = useLotteryContract()

  const handleGetTotalTokenSold = useCallback(
    async () => {
      try {
        const totaTokenSold = await lotteryContract.getLotteryStatus(1)
        // return parseFloat(formatEther(totaTokenSold))
        return parseInt(totaTokenSold)
      } catch(e)
      {
        console.error('Failed to setTokenPrice', e)
        return NaN;
      }
    },
    [lotteryContract],
  )

  return { onGetTotalTokenSold: handleGetTotalTokenSold }
}

export const buyTokenUsingBNB = async (
  contract: ethers.Contract,
  collectionAddress: string,
  tokenId: number,
): Promise<string> => {
  try {
    const tx = await contract.buyTokenUsingBNB(collectionAddress, tokenId)
    const receipt = await tx.wait()
    return receipt.transactionHash
  } catch (error) {
    console.error(error)
    return null
  }
}

export const useGetBalanceOfBUSD = () => {
  const lotteryContract = useLotteryContract()

  const handleGetBalanceOfBUSD = useCallback(
    async () => {
      try {
        const balanceOfToken = await lotteryContract.getBalanceOfToken()
        return parseInt(balanceOfToken)
      } catch(e)
      {
        console.error('Failed to getBalanceOfToken', e)
        return NaN;
      }
    },
    [lotteryContract]
  )

  return { onGetBalanceOfBUSD: handleGetBalanceOfBUSD }
}

export const useGetLotteryCycle = () => {
  const lotteryContract = useLotteryContract()

  const handleGetLotteryCycle = useCallback(
    async () => {
      try {
        const lotteryCycle = await lotteryContract.getLotteryCycle()
        return parseInt(lotteryCycle)
      } catch(e)
      {
        console.error('Failed to getLotteryCycle', e)
        return NaN;
      }
    },
    [lotteryContract]
  )

  return { onGetLotteryCycle: handleGetLotteryCycle }
}

export const useGetLotteryRemainTime = () => {
  const lotteryContract = useLotteryContract()

  const handleGetLotteryRemainTime = useCallback(
    async (lotteryID: number) => {
      try {
        const lotteryRemainTime = await lotteryContract.getLotteryRemainTime(lotteryID)
        return parseInt(lotteryRemainTime)
      } catch(e)
      {
        console.error('Failed to getLotteryRemainTime', e)
        return NaN;
      }
    },
    [lotteryContract]
  )

  return { onGetLotteryRemainTime: handleGetLotteryRemainTime }
}

export const useGetRestAmountOfTicket = () => {
  const lotteryContract = useLotteryContract()

  const handleGetRestAmountOfTicket = useCallback(
    async (lotteryID: number) => {
      try {
        const restAmountOfTicket = await lotteryContract.getRestAmountOfTicket(lotteryID)
        return parseInt(restAmountOfTicket)
      } catch(e)
      {
        console.error('Failed to getRestAmountOfTicket', e)
        return NaN;
      }
    },
    [lotteryContract]
  )

  return { onGetRestAmountOfTicket: handleGetRestAmountOfTicket }
}

export const useGetLotteryStatus = () => {
  const lotteryContract = useLotteryContract()

  const handleGetLotteryStatus = useCallback(
    async (lotteryID: number) => {
      try {
        const lotteryStatus = await lotteryContract.getLotteryStatus(lotteryID)
        const status = parseInt(lotteryStatus)
        switch (status) {
          case 0:
            return "NotStarted"
          case 1:
            return "Open"
          case 2:
            return "Closed"
          case 3:
            return "Completed"
          case 4:
            return "Prized"
          default:
            return ""
        }
      } catch(e)
      {
        console.error('Failed to getLotteryStatus', e)
        return "";
      }
    },
    [lotteryContract]
  )

  return { onGetLotteryStatus: handleGetLotteryStatus }
}

export const useGetLotteryLevel = () => {
  const lotteryContract = useLotteryContract()

  const handleGetLotteryLevel = useCallback(
    async (lotteryID: number) => {
      try {
        const lotteryLevel = await lotteryContract.getLotteryLevel(lotteryID)
        const level = parseInt(lotteryLevel)
        switch (level) {
          case 0:
            return "Level1"
          case 1:
            return "Level2"
          case 2:
            return "Level3"
          case 3:
            return "Level4"
          case 4:
            return "Level5"
          case 5:
            return "Level6"
          default:
            return ""
        }
      } catch(e)
      {
        console.error('Failed to getLotteryLevel', e)
        return "";
      }
    },
    [lotteryContract]
  )

  return { onGetLotteryLevel: handleGetLotteryLevel }
}

export const useGetWiner = () => {
  const lotteryContract = useLotteryContract()

  const handleGetWiner = useCallback(
    async (lotteryID: number) => {
      try {
        const getWiner = await lotteryContract.getWiner(lotteryID)
        return getWiner.toString()
      } catch(e)
      {
        console.error('Failed to getWiner', e)
        return "";
      }
    },
    [lotteryContract]
  )

  return { onGetWiner: handleGetWiner }
}

export const useGetTreasury = () => {
  const lotteryContract = useLotteryContract()

  const handleGetTreasury = useCallback(
    async () => {
      try {
        const treasury = await lotteryContract.TREASURY()
        return treasury.toString()
      } catch(e)
      {
        console.error('Failed to get Treasury', e)
        return "";
      }
    },
    [lotteryContract]
  )

  return { onGetTreasury: handleGetTreasury }
}