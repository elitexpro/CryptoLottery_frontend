import React, { ChangeEvent, useEffect, useState } from "react";
import { Heading, Button, Input, Text } from '@pancakeswap/uikit'
import { formatBigNumber } from 'utils/formatBalance'
import { useWeb3React } from '@web3-react/core'
import { parseUnits, formatEther } from 'ethers/lib/utils'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useLotteryContract } from 'hooks/useContract'
import { getLotteryAddress } from 'utils/addressHelpers'
import { isAddress } from 'utils'
import { useGetBnbBalance, useGetTotalTokenSold, useGetNMDTokenprice, useGetBalanceOfBUSD, useGetLotteryCycle, useGetLotteryRemainTime, 
  useGetRestAmountOfTicket,
  useGetLotteryStatus,
  useGetLotteryLevel,
  useGetWiner
 } 
  from './PreSaleTokenModal';

const NmdPresale = () => {

  const floorTokenAmount = 0.0001
  const floorGasPrice = 0.001

  const lotteryContract = useLotteryContract()
  const { onGetNMDTokenprice } = useGetNMDTokenprice()
  
  const { onGetBalanceOfBUSD } = useGetBalanceOfBUSD()
  const { onGetLotteryCycle } = useGetLotteryCycle()
  const { onGetLotteryRemainTime } = useGetLotteryRemainTime()
  const { onGetRestAmountOfTicket } = useGetRestAmountOfTicket()
  const { onGetLotteryStatus } = useGetLotteryStatus()
  const { onGetLotteryLevel } = useGetLotteryLevel()
  const { onGetWiner } = useGetWiner()  

  const { onGetTotalTokenSold } = useGetTotalTokenSold()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { account } = useWeb3React()
  const balanceOfTokenPreSale = useGetBnbBalance(getLotteryAddress())
  const balanceOfUser = useGetBnbBalance(account);

  const [tokenAmountPerBNB, setTokenAmountPerBNB] = useState(0);

  const [balanceOfBUSD, setBalanceOfBUSD] = useState(0);
  const [lotteryCycle, setLotteryCycle] = useState(0);
  const [lotteryID, setLotteryID] = useState("");
  const [newTreasury, setNewTreasury] = useState("");
  const [lotteryRemainTime, setLotteryRemainTime] = useState(0);
  const [restAmountOfTicket, setRestAmountOfTicket] = useState(0);
  const [lotteryStatus, setLotteryStatus] = useState("");
  const [lotteryLevel, setLotteryLevel] = useState("");
  const [winner, setWinner] = useState("");
  const [treasury, setTreasury] = useState("");
  const [lottoInfo, setLottoInfo] = useState();

  const [totaltokensold, setTotalTokenSold] = useState(0)
  const [balanceOfBNB, setRaisedBNB] = useState("");
  const [bnbAmount, setBNBAmount] = useState(0.0);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [BNBStatus, setBNBStatus] = useState("");
  const [pendingTx, setPendingTx] = useState(false)
  const [pendingBuyTx, setPendingBuyTx] = useState(false)
  const [timeup, setTimeup] = useState(false)
  const [count, setCount] = useState(false)
  const [status, setStatus] = useState("")

  setTimeout(() => {
    const set = !timeup
    setTimeup(set)
  }, 5000);
  
  useEffect(() => { // All get
    async function fetchData() {
        setPendingTx(true);
        try{
            setCount(timeup)
            setTokenAmountPerBNB(await onGetNMDTokenprice())
            setBalanceOfBUSD(await onGetBalanceOfBUSD())
            setLotteryCycle(await onGetLotteryCycle())
            setTotalTokenSold(await onGetTotalTokenSold())
            setRaisedBNB(formatBigNumber(balanceOfTokenPreSale, 6))
            setPendingTx(false);
        }
        catch (e)
        {
            console.error('Failed to Get', e)
            setPendingTx(false);
        }
    }
    fetchData();
  }, [onGetNMDTokenprice, onGetBalanceOfBUSD, onGetLotteryCycle, tokenAmountPerBNB, balanceOfBUSD, lotteryCycle, onGetTotalTokenSold, totaltokensold, balanceOfUser, balanceOfTokenPreSale, timeup, setCount])

  const buyTokenAmountChange = (evt: ChangeEvent<HTMLInputElement>) => {
    if (Number.isNaN(parseInt(evt.target.value)) === true)
    {
      setTokenAmount(0)
    }
    else
    {
      setTokenAmount(parseInt(evt.target.value))
    }
  };

  const inParamLotteryIDChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setLotteryID(evt.target.value)
  };

  const inParamNewTreasuryChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setNewTreasury(evt.target.value)
  };

  useEffect(() => {
    setBNBAmount(tokenAmount / tokenAmountPerBNB);
    if ((tokenAmount / tokenAmountPerBNB) < floorTokenAmount) setBNBStatus(`BNB Amount should be over ${floorTokenAmount}`);
    else setBNBStatus("");
  }, [tokenAmount, tokenAmountPerBNB])

  const handleBuyPressed = async () => { 

    if ((tokenAmount / tokenAmountPerBNB) < floorTokenAmount)
    {
        setStatus(`BNB Amount should be over ${floorTokenAmount}`)
        return false
    }
    
    if ( (parseFloat(formatEther(balanceOfUser)) === 0) || (bnbAmount - floorGasPrice > parseFloat(formatEther(balanceOfUser))))
    {
        setStatus(`BNB Amount is not enough. Your Wallet Amount: ${formatEther(balanceOfUser)}`)
        return false
    }
    
    setPendingBuyTx(true)
    try{
        const tx = await callWithGasPrice(lotteryContract, 'buyTokens', [], { 
            value: parseUnits(bnbAmount.toString()) })
        const receipt = await tx.wait()

        if (receipt.transactionHash)
        {
            setStatus(`✅ Check out your transaction on bscscan: https://bscscan.com/tx/${receipt.transactionHash}`)
        }
        else
        {
            setStatus(`😥 transaction fail!`)
        }
        setPendingBuyTx(false)
        return true
    }
    catch (e)
    {
        setPendingBuyTx(false)
        setStatus(`😥 Something went wrong: ${e}`)
        return false
    }
  };

  const handleSetTREASURYPressed = async () => { 

    if (isAddress(newTreasury) === false)
    {
        setStatus(`Address fail, please retry`)
        return false
    }
    const realNewTreasury = isAddress(newTreasury)
    
    setPendingBuyTx(true)
    try{
        const tx = await callWithGasPrice(lotteryContract, 'setTREASURY', [realNewTreasury])
        const receipt = await tx.wait()

        if (receipt.transactionHash)
        {
            setStatus(`✅ Check out your transaction on bscscan: https://bscscan.com/tx/${receipt.transactionHash}`)
        }
        else
        {
            setStatus(`😥 transaction fail!`)
        }
        setPendingBuyTx(false)
        return true
    }
    catch (e)
    {
        setPendingBuyTx(false)
        setStatus(`😥 Something went wrong: ${e}`)
        return false
    }
  };

  const handleLotteryRemainTimePressed = async () => { 
    setPendingBuyTx(true)
    setLotteryRemainTime(await onGetLotteryRemainTime(parseInt(lotteryID)))
    setPendingBuyTx(false)
  };

  const handleRestAmountOfTicketPressed = async () => { 
    setPendingBuyTx(true)
    setRestAmountOfTicket(await onGetRestAmountOfTicket(parseInt(lotteryID)))
    setPendingBuyTx(false)
  };
  
  const handleLotteryStatusPressed = async () => { 
    setPendingBuyTx(true)
    setLotteryStatus(await onGetLotteryStatus(parseInt(lotteryID)))
    setPendingBuyTx(false)
  };

  const handleLotteryLevelPressed = async () => { 
    setPendingBuyTx(true)
    setLotteryLevel(await onGetLotteryLevel(parseInt(lotteryID)))
    setPendingBuyTx(false)
  };

  const handleWinnerPressed = async () => { 
    setPendingBuyTx(true)
    setWinner(await onGetWiner(parseInt(lotteryID)))
    setPendingBuyTx(false)
  };
  
  const handleTreasuryPressed = async () => { 
    setPendingBuyTx(true)
    setWinner(await onGetWiner(parseInt(lotteryID)))
    setPendingBuyTx(false)
  };
  
  const renderStatusString = () => {
    return (
      <p>
        {" "}
        🦊{" "}
        <a target="_blank" href="https://metamask.io/download.html" rel="noreferrer">
          You must install Metamask, in your browser.
        </a>
      </p>
    );  
  }

  return (
    <div>
        <Heading scale="xl" color="secondary" mb="10px">
          
          <Heading scale="lg" color="blue" mb="24px" textAlign="center">
            Lottery Contract Test
            <br/>
            BNB Balance: {balanceOfBNB} BNB,
            BUSD Balance: {balanceOfBUSD} BUSD,
            LotteryCycle: {lotteryCycle} Second
          </Heading>
          <Heading>
            <Heading scale="lg" color="blue" mb="24px" textAlign="center">
              GetFunctions
            </Heading>
            <br/>
            LotteryID
            <Input
            id="LotteryID"
            placeholder="Input LotteryID"
            value={lotteryID}
            onChange={inParamLotteryIDChange}
            style={{ position: 'relative', zIndex: 10, paddingRight: '8px', maxWidth: '150px', textAlign: 'right'}}
            />
            <Button disabled={pendingBuyTx} id="LotteryRemainTime" onClick={handleLotteryRemainTimePressed} >
            LotteryRemainTime
            </Button>
            <Button disabled={pendingBuyTx} id="RestAmountOfTicket" onClick={handleRestAmountOfTicketPressed} >
            RestAmountOfTicket
            </Button>
            <Button disabled={pendingBuyTx} id="LotteryStatus" onClick={handleLotteryStatusPressed} >
            LotteryStatus
            </Button>
            <Button disabled={pendingBuyTx} id="LotteryLevel" onClick={handleLotteryLevelPressed} >
            LotteryLevel
            </Button>
            <Button disabled={pendingBuyTx} id="Winer" onClick={handleWinnerPressed} >
            Winer
            </Button>
            <Button disabled={pendingBuyTx} id="Treasury" onClick={handleTreasuryPressed} >
            Winer
            </Button>
            <br/>
            LotteryRemainTime: {lotteryRemainTime}
            <br/>
            RestAmountOfTicket: {restAmountOfTicket}
            <br/>
            LotteryStatus: {lotteryStatus}
            <br/>
            LotteryLevel: {lotteryLevel}
            <br/>
            Winner: {winner}
            <br/>
            MemberInfo: {}
            <br/>
            LottoInfo: {}
          </Heading>

          <Heading>
            <Heading scale="lg" color="blue" mb="24px" textAlign="center">
              SetFunctions and Transactions
            </Heading>
            <br/>
            New Treasury address
            <Input
            id="NewTreasury"
            placeholder="Input new treasury address"
            value={newTreasury}
            onChange={inParamNewTreasuryChange}
            style={{ position: 'relative', zIndex: 10, paddingRight: '8px', maxWidth: '400px', textAlign: 'right'}}
            />
            <Button disabled={pendingBuyTx} id="SetTREASURY" onClick={handleSetTREASURYPressed} >
            SetTREASURY
            </Button>
            <Button disabled={pendingBuyTx} id="RestAmountOfTicket" onClick={handleRestAmountOfTicketPressed} >
            RestAmountOfTicket
            </Button>
            <Button disabled={pendingBuyTx} id="LotteryStatus" onClick={handleLotteryStatusPressed} >
            LotteryStatus
            </Button>
            <Button disabled={pendingBuyTx} id="LotteryLevel" onClick={handleLotteryLevelPressed} >
            LotteryLevel
            </Button>
            <Button disabled={pendingBuyTx} id="Winer" onClick={handleWinnerPressed} >
            Winer
            </Button>
            <br/>
            LotteryRemainTime: {lotteryRemainTime}
            <br/>
            RestAmountOfTicket: {restAmountOfTicket}
            <br/>
            LotteryStatus: {lotteryStatus}
            <br/>
            LotteryLevel: {lotteryLevel}
            <br/>
            Winner: {winner}
            <br/>
            MemberInfo: {}
            <br/>
            LottoInfo: {}
          </Heading>
          

          {/* <Heading scale="xl" color="secondary" mb="10px">
          Token Sold: {totaltokensold} NMD
            <br/>
            Token Price: { tokenAmountPerBNB }  BNB
          NMD amount
          </Heading>

          <Input
            id="buyTokenAmount"
            placeholder=""
            value={tokenAmount}
            onChange={buyTokenAmountChange}
            style={{ position: 'relative', marginLeft: (window.innerWidth - 120)/2 , zIndex: 16, paddingRight: '10px', maxWidth: '110px', textAlign: 'right'}}
          />

          <Heading scale="xl" color="secondary" mb="10px">
          BNB Amount :
            { bnbAmount } BNB
          </Heading>

          <Heading color='red' mb="16px">
          {BNBStatus}
          </Heading>

          <Button disabled={pendingBuyTx} id="buyButton" onClick={handleBuyPressed} >
            BUY TICKET
          </Button> */}

          <Heading id = "status" color='red' mb="16px">
            {status !== "renderStatusString" ? status : renderStatusString()}
          </Heading>
        </Heading>
      </div>
  );
};

export default NmdPresale;
