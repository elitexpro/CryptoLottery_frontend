import React, { ChangeEvent, useEffect, useState } from "react";
import { Heading, Button, Input, Text } from '@pancakeswap/uikit'
import Column, { AutoColumn } from 'components/Layout/Column'
import Row from 'components/Layout/Row'
import { formatBigNumber } from 'utils/formatBalance'
import { useWeb3React } from '@web3-react/core'
import { parseUnits, formatEther } from 'ethers/lib/utils'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useLotteryContract, useNMDTokenContract } from 'hooks/useContract'
import { getLotteryAddress } from 'utils/addressHelpers'
import { ethers, utils } from 'ethers'
import { isAddress } from 'utils'
import { useGetBnbBalance, useGetTotalTokenSold, useGetNMDTokenprice, useGetBalanceOfBUSD, useGetLotteryCycle, useGetLotteryRemainTime, 
  useGetRestAmountOfTicket,
  useGetLotteryStatus,
  useGetLotteryLevel, 
  useGetWiner,
  useGetTreasury,
  useGetMemberInfo,
  useGetLottoInfo,
  useGetBUSD,
  useGetPricePerTicket,
  // useSetTreasury
 } 
  from './LotteryModal';

const Lottery = () => {

  const floorTokenAmount = 0.0001
  const floorGasPrice = 0.001

  const lotteryContract = useLotteryContract()
  const nmdTokenContract = useNMDTokenContract()
  const { account, library } = useWeb3React()
  const balanceOfLottery = useGetBnbBalance(getLotteryAddress())
  const balanceOfUser = useGetBnbBalance(account);
  const [pendingTx, setPendingTx] = useState(false)

  const { callWithGasPrice } = useCallWithGasPrice()
  
  const { onGetBalanceOfBUSD } = useGetBalanceOfBUSD()
  const { onGetLotteryCycle } = useGetLotteryCycle()
  const { onGetLotteryRemainTime } = useGetLotteryRemainTime()
  const { onGetRestAmountOfTicket } = useGetRestAmountOfTicket()
  const { onGetLotteryStatus } = useGetLotteryStatus()
  const { onGetLotteryLevel } = useGetLotteryLevel()
  const { onGetWiner } = useGetWiner()  
  const { onGetTreasury } = useGetTreasury()  
  const { onGetBUSD } = useGetBUSD()
  const { onGetMemberInfo } = useGetMemberInfo()  
  const { onGetLottoInfo } = useGetLottoInfo()  
  const { onGetPricePerTicket } = useGetPricePerTicket()

  // const { onSetTreasury } = useSetTreasury()
  
  const [balanceOfBNB, setBalanceOfBNB] = useState("0")
  const [balanceOfBUSD, setBalanceOfBUSD] = useState(0)
  const [lotteryCycle, setLotteryCycle] = useState(0);
  const [lotteryID, setLotteryID] = useState("");
  const [newTreasury, setNewTreasury] = useState("");
  const [lotteryRemainTime, setLotteryRemainTime] = useState(0);
  const [restAmountOfTicket, setRestAmountOfTicket] = useState(0);
  const [lotteryStatus, setLotteryStatus] = useState("");
  const [lotteryLevel, setLotteryLevel] = useState("");
  const [winner, setWinner] = useState("");
  const [treasury, setTreasury] = useState("");
  const [busd, setBUSD] = useState("");
  const [lottoInfo, setLottoInfo] = useState();
  const [memberInfo, setMemberInfo] = useState();
  const [newLotteryCycle, setNewLotteryCycle] = useState("");
  const [createNewLottoParam, setCreatNewLotto] = useState("");
  const [ticketAmountOfBuyTicket, setBuyTicketParam] = useState("");
  const [lotteryIDofBuyTicket, setLotteryIDofBuyTicketParam] = useState("");
  const [lotteryIDOfWhoIsWinner, setLotteryIDOfWhoIsWinner] = useState("")
  const [lotteryIDOfWinnerGetPrize, setLotteryIDOfWinnerGetPrize] = useState("")

  const { onGetNMDTokenprice } = useGetNMDTokenprice()
  const { onGetTotalTokenSold } = useGetTotalTokenSold()

  const [tokenAmountPerBNB, setTokenAmountPerBNB] = useState(0);

  const [totaltokensold, setTotalTokenSold] = useState(0)
  const [bnbAmount, setBNBAmount] = useState(0.0);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [BNBStatus, setBNBStatus] = useState("");
  const [timeup, setTimeup] = useState(false)
  const [count, setCount] = useState(false)
  const [status, setStatus] = useState("")

  setTimeout(() => {
    const set = !timeup
    setTimeup(set)
  }, 5000000);
  
  useEffect(() => { // All get
    async function fetchData() {
        setPendingTx(true);
        try{
            setCount(timeup)
            setTokenAmountPerBNB(await onGetNMDTokenprice())
            setTotalTokenSold(await onGetTotalTokenSold())
            setPendingTx(false);
        }
        catch (e)
        {
            console.error('Failed to Get', e)
            setPendingTx(false);
        }
    }
    fetchData();
  }, [onGetNMDTokenprice, tokenAmountPerBNB, onGetTotalTokenSold, totaltokensold, balanceOfUser, timeup, setCount])

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

  useEffect(() => {
    setBNBAmount(tokenAmount / tokenAmountPerBNB);
    if ((tokenAmount / tokenAmountPerBNB) < floorTokenAmount) setBNBStatus(`BNB Amount should be over ${floorTokenAmount}`);
    else setBNBStatus("");
  }, [tokenAmount, tokenAmountPerBNB])

  const handleBuyPressed = () => { 

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
    
    setPendingTx(true)
    setPendingTx(false)
    return false
  };

  // btn click handlers
  const inParamLotteryIDChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setLotteryID(evt.target.value)
  };

  const inParamNewTreasuryChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setNewTreasury(evt.target.value)
  };

  const inParamNewLotteryCycleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setNewLotteryCycle(evt.target.value)
  };
  
  const inParamCreatNewLottoChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setCreatNewLotto(evt.target.value)
  };

  const inParamBuyTicketChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setBuyTicketParam(evt.target.value)
  };
  
  const inParam2BuyTicketChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setLotteryIDofBuyTicketParam(evt.target.value)
  };

  const inParamWhoIsWinnerChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setLotteryIDOfWhoIsWinner(evt.target.value);
  }
  
  const inParamWinnerGetPrizeChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setLotteryIDOfWinnerGetPrize(evt.target.value);
  }
  
  // get functions
  const handleBNBBalancePressed = async () => { 
    setPendingTx(true)
    setBalanceOfBNB(formatBigNumber(balanceOfLottery, 6))
    setPendingTx(false)
  };

  const handleBUSDBalancePressed = async () => { 
    setPendingTx(true)
    setBalanceOfBUSD(await onGetBalanceOfBUSD())
    setPendingTx(false)
  };

  const handleLotteryCyclePressed = async () => { 
    setPendingTx(true)
    setLotteryCycle(await onGetLotteryCycle())
    setPendingTx(false)
  };

  const handleLotteryRemainTimePressed = async () => { 
    setPendingTx(true)
    setLotteryRemainTime(await onGetLotteryRemainTime(parseInt(lotteryID)))
    setPendingTx(false)
  };

  const handleRestAmountOfTicketPressed = async () => { 
    setPendingTx(true)
    setRestAmountOfTicket(await onGetRestAmountOfTicket(parseInt(lotteryID)))
    setPendingTx(false)
  };
  
  const handleLotteryStatusPressed = async () => { 
    setPendingTx(true)
    setLotteryStatus(await onGetLotteryStatus(parseInt(lotteryID)))
    setPendingTx(false)
  };

  const handleLotteryLevelPressed = async () => { 
    setPendingTx(true)
    setLotteryLevel(await onGetLotteryLevel(parseInt(lotteryID)))
    setPendingTx(false)
  };

  const handleWinnerPressed = async () => { 
    setPendingTx(true)
    setWinner(await onGetWiner(parseInt(lotteryID)))
    setPendingTx(false)
  };
  
  const handleTreasuryPressed = async () => { 
    setPendingTx(true)
    setTreasury(await onGetTreasury())
    setPendingTx(false)
  };

  const handleBUSDPressed = async () => { 
    setPendingTx(true)
    setBUSD(await onGetBUSD())
    setPendingTx(false)
  };

  const handleMemberInfoPressed = async () => { 
    setPendingTx(true)
    setMemberInfo(await onGetMemberInfo())
    setPendingTx(false)
  };

  const handleLottoInfoPressed = async () => { 
    setPendingTx(true)
    setLottoInfo(await onGetLottoInfo())
    setPendingTx(false)
  };

  // set functions and transactions
  const handleSetTREASURYPressed = async () => { 
    if (!account)
    {
      setStatus(`please connect wallet!`)
      return false;
    }
    if (isAddress(newTreasury) === false)
    {
        setStatus(`Address fail, please retry!`)
        return false
    }
    const _newTreasury = isAddress(newTreasury).toString()
    
    setPendingTx(true)
    try{
        const tx = await callWithGasPrice(lotteryContract, 'setTREASURY', [_newTreasury])
        const receipt = await tx.wait()

        if (receipt.transactionHash)
        {
          // setStatus(`${tx}`)
          setStatus(`✅ Check out your transaction on bscscan: https://bscscan.com/tx/${receipt.transactionHash}`)
        }
        else
        {
            setStatus(`😥 transaction fail!`)
        }
        setPendingTx(false)
        return true
    }
    catch (e)
    {
        setPendingTx(false)
        setStatus(`😥 Something went wrong: ${e}`)
        return false
    }
    // setPendingTx(true)
    // const retVal = await onSetTreasury(_newTreasury)
    // setStatus(`RetVal: ${retVal}`)
    // setPendingTx(false)
    // return false
  };

  const handleSetLotteryCyclePressed = async () => {
    if (!account)
    {
      setStatus(`please connect wallet!`)
      return false;
    }
    const _newLotteryCycle = parseInt(newLotteryCycle);
    if (_newLotteryCycle <= 0 || Number.isNaN(_newLotteryCycle))
    {
      setStatus(`Input Error, please retry!`)
      return false;
    }
    setPendingTx(true)
    try{
        const tx = await callWithGasPrice(lotteryContract, 'setLotteryCycle', [_newLotteryCycle])
        const receipt = await tx.wait()

        if (receipt.transactionHash)
        {
            console.log(`1=========================`)
            console.log(receipt)
            console.log(`2=========================`)
            setStatus(`✅ Check out your transaction on bscscan: https://bscscan.com/tx/${receipt.transactionHash}`)
        }
        else
        {
            setStatus(`😥 transaction fail!`)
        }
        setPendingTx(false)
        return true
    }
    catch (e)
    {
        setPendingTx(false)
        setStatus(`😥 Something went wrong: ${e}`)
        return false
    }
  };
  
  const handleCreatNewLottoPressed = async () => {
    if (!account)
    {
      setStatus(`please connect wallet!`)
      return false;
    }
    const _createNewLottoParam = parseInt(createNewLottoParam);
    if (_createNewLottoParam < 0 || Number.isNaN(_createNewLottoParam))
    {
      setStatus(`Input Error, please retry!`)
      return false;
    }
    setPendingTx(true)
    try{
        const tx = await callWithGasPrice(lotteryContract, 'createNewLotto', [_createNewLottoParam])
        const receipt = await tx.wait()

        if (receipt.transactionHash)
        {
            console.log(`1=========================`)
            console.log(receipt)
            console.log(`2=========================`)
            setStatus(`✅ Check out your transaction on bscscan: https://bscscan.com/tx/${receipt.transactionHash}`)
        }
        else
        {
            setStatus(`😥 transaction fail!`)
        }
        setPendingTx(false)
        return true
    }
    catch (e)
    {
        setPendingTx(false)
        console.log(`1=========================`)
        console.log(e)
        console.log(`2=========================`)
        setStatus(`😥 Something went wrong: ${e}`)
        return false
    }
  };
  
  const handleBuyTicketPressed = async () => {
    if (!account)
    {
      setStatus(`please connect wallet!`)
      return false;
    }
    const _ticketAmountOfBuyTicket = parseInt(ticketAmountOfBuyTicket);
    if (_ticketAmountOfBuyTicket < 1 || Number.isNaN(_ticketAmountOfBuyTicket))
    {
      setStatus(`Input Error, please retry!`)
      return false;
    }
    const _lotteryIDofBuyTicket = parseInt(lotteryIDofBuyTicket);
    if (Number.isNaN(_lotteryIDofBuyTicket))
    {
      setStatus(`Input Error, please retry!`)
      return false;
    }
    
    setPendingTx(true)
    const pricePerTicket = await onGetPricePerTicket(_lotteryIDofBuyTicket)
    if (Number.isNaN(parseInt(pricePerTicket)) || parseInt(pricePerTicket) <= 0)
    {
      setStatus(`Fail to get ticket price!`)
      setPendingTx(false)
      return false;
    }

    try{
        const tx = await callWithGasPrice(nmdTokenContract, 'approve', [lotteryContract.address, utils.parseEther(Number(_ticketAmountOfBuyTicket * pricePerTicket).toString())])
        const receipt = await tx.wait()

        if (receipt.transactionHash)
        {
            console.log(`1=========================success`)
            console.log(tx)
            console.log(`2=========================success`)
            console.log(receipt)
            console.log(`3=========================success`)
            setStatus(`✅ Check out your transaction on bscscan: https://bscscan.com/tx/${receipt.transactionHash}`)
        }
        else
        {
            setStatus(`😥 transaction fail!`)
        }
        setPendingTx(false)
    }
    catch (e)
    {
        setPendingTx(false)
        console.log(`1=========================fail`)
        console.log(e)
        console.log(`2=========================fail`)
        setStatus(`😥 Something went wrong: ${e}`)
        return false
    }
    setPendingTx(true)
    try{
        const tx = await callWithGasPrice(lotteryContract, 'buyTicket', [_lotteryIDofBuyTicket, _ticketAmountOfBuyTicket])
        const receipt = await tx.wait()

        if (receipt.transactionHash)
        {
            console.log(`1=========================success`)
            console.log(receipt)
            console.log(`2=========================success`)
            setStatus(`✅ Check out your transaction on bscscan: https://bscscan.com/tx/${receipt.transactionHash}`)
        }
        else
        {
            setStatus(`😥 transaction fail!`)
        }
        setPendingTx(false)
        return true
    }
    catch (e)
    {
        setPendingTx(false)
        console.log(`1=========================fail`)
        console.log(e)
        console.log(`2=========================fail`)
        setStatus(`😥 Something went wrong: ${e}`)
        return false
    }
  };
  
  const handleWhoIsWinnerPressed = async () => {
    if (!account)
    {
      setStatus(`please connect wallet!`)
      return false;
    }
    const _lotteryIDOfWhoIsWinner = parseInt(lotteryIDOfWhoIsWinner);
    if (_lotteryIDOfWhoIsWinner < 0 || Number.isNaN(_lotteryIDOfWhoIsWinner))
    {
      setStatus(`Input Error, please retry!`)
      return false;
    }
    setPendingTx(true)
    try{
        const tx = await callWithGasPrice(lotteryContract, 'whoIsWinner', [_lotteryIDOfWhoIsWinner])
        const receipt = await tx.wait()

        if (receipt.transactionHash)
        {
            console.log(`1=========================`)
            console.log(receipt)
            console.log(`2=========================`)
            setStatus(`✅ Check out your transaction on bscscan: https://bscscan.com/tx/${receipt.transactionHash}`)
        }
        else
        {
            setStatus(`😥 transaction fail!`)
        }
        setPendingTx(false)
        return true
    }
    catch (e)
    {
        setPendingTx(false)
        console.log(`1=========================`)
        console.log(e)
        console.log(`2=========================`)
        setStatus(`😥 Something went wrong: ${e}`)
        return false
    }
  };

  const handleWinnerGetPrizePressed = async () => {
    if (!account)
    {
      setStatus(`please connect wallet!`)
      return false;
    }
    const _lotteryIDOfWinnerGetPrize = parseInt(lotteryIDOfWinnerGetPrize);
    if (_lotteryIDOfWinnerGetPrize < 0 || Number.isNaN(_lotteryIDOfWinnerGetPrize))
    {
      setStatus(`Input Error, please retry!`)
      return false;
    }
    setPendingTx(true)
    try{
        const tx = await callWithGasPrice(lotteryContract, 'winnerGetPrize', [_lotteryIDOfWinnerGetPrize])
        const receipt = await tx.wait()

        if (receipt.transactionHash)
        {
            console.log(`1=========================`)
            console.log(receipt)
            console.log(`2=========================`)
            setStatus(`✅ Check out your transaction on bscscan: https://bscscan.com/tx/${receipt.transactionHash}`)
        }
        else
        {
            setStatus(`😥 transaction fail!`)
        }
        setPendingTx(false)
        return true
    }
    catch (e)
    {
        setPendingTx(false)
        console.log(`1=========================`)
        console.log(e)
        console.log(`2=========================`)
        setStatus(`😥 Something went wrong: ${e}`)
        return false
    }
  };

  const handleEndLotteryProjectPressed = async () => {
    if (!account)
    {
      setStatus(`please connect wallet!`)
      return false;
    }
    setPendingTx(true)
    try{
        const tx = await callWithGasPrice(lotteryContract, 'endLotteryProject', [])
        const receipt = await tx.wait()

        if (receipt.transactionHash)
        {
            console.log(`1=========================`)
            console.log(receipt)
            console.log(`2=========================`)
            setStatus(`✅ Check out your transaction on bscscan: https://bscscan.com/tx/${receipt.transactionHash}`)
        }
        else
        {
            setStatus(`😥 transaction fail!`)
        }
        setPendingTx(false)
        return true
    }
    catch (e)
    {
        setPendingTx(false)
        console.log(`1=========================`)
        console.log(e)
        console.log(`2=========================`)
        setStatus(`😥 Something went wrong: ${e}`)
        return false
    }
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
            Contract Address on BSC Testnet is {lotteryContract.address}
          </Heading>
          <Heading>
            <Heading scale="lg" color="blue" mb="24px" textAlign="center">
              GetFunctions
            </Heading>

            {/* BNB Balance */}
            <Row>
              <Button disabled={pendingTx} id="BNBBalance" scale="sm" onClick={handleBNBBalancePressed} >
                BNB Balance
              </Button>
              {balanceOfBNB} BNB
            </Row>
            {/* BUSD Balance */}
            <Row>
              <Button disabled={pendingTx} id="BUSDBalance" scale="sm" onClick={handleBUSDBalancePressed} >
              NMD Balance
              </Button>
              {balanceOfBUSD} BUSD
            </Row>
            {/* Lottery Cycle */}
            <Row>
              <Button disabled={pendingTx} id="LotteryCycle" scale="sm" onClick={handleLotteryCyclePressed} >
              LotteryCycle
              </Button>
              {lotteryCycle} Second
            </Row>
            {/* Treasury */}
            <Row>
              <Button disabled={pendingTx} id="Treasury" scale="sm" onClick={handleTreasuryPressed} >
              Treasury
              </Button>
              {treasury}
            </Row>
            {/* BUSD Address */}
            <Row>
              <Button disabled={pendingTx} id="BUSD Address" scale="sm" onClick={handleBUSDPressed} >
              BUSD Address
              </Button>
              {busd}
            </Row>
            {/* LotteryRemainTime */}
            <Row>
              {/* <Text>Input</Text> */}
              <Input
              id="LotteryID"
              placeholder="Input LotteryID"
              scale="sm"
              value={lotteryID}
              onChange={inParamLotteryIDChange}
              style={{ position: 'relative', zIndex: 0, paddingRight: '8px', maxWidth: '150px', textAlign: 'right'}}
              />
              <Button disabled={pendingTx} id="LotteryRemainTime" scale="sm" onClick={handleLotteryRemainTimePressed} >
              LotteryRemainTime
              </Button>
              {lotteryRemainTime}
            </Row>
            {/* RestAmountOfTicket */}
            <Row>
              {/* <Text>Input</Text> */}
              <Input
              id="LotteryID"
              placeholder="Input LotteryID"
              scale="sm"
              value={lotteryID}
              onChange={inParamLotteryIDChange}
              style={{ position: 'relative', zIndex: 0, paddingRight: '8px', maxWidth: '150px', textAlign: 'right'}}
              />            
              <Button disabled={pendingTx} id="RestAmountOfTicket" scale="sm" onClick={handleRestAmountOfTicketPressed} >
              RestAmountOfTicket
              </Button>
              {restAmountOfTicket}
            </Row>
            {/* LotteryStatus */}
            <Row>
              {/* <Text>Input</Text> */}
              <Input
              id="LotteryID"
              placeholder="Input LotteryID"
              scale="sm"
              value={lotteryID}
              onChange={inParamLotteryIDChange}
              style={{ position: 'relative', zIndex: 0, paddingRight: '8px', maxWidth: '150px', textAlign: 'right'}}
              />
              <Button disabled={pendingTx} id="LotteryStatus" scale="sm" onClick={handleLotteryStatusPressed} >
              LotteryStatus
              </Button>
              {lotteryStatus}
            </Row>
            {/* LotteryLevel */}
            <Row>
              {/* <Text>Input</Text> */}
              <Input
              id="LotteryID"
              placeholder="Input LotteryID"
              scale="sm"
              value={lotteryID}
              onChange={inParamLotteryIDChange}
              style={{ position: 'relative', zIndex: 0, paddingRight: '8px', maxWidth: '150px', textAlign: 'right'}}
              />
              <Button disabled={pendingTx} id="LotteryLevel" scale="sm" onClick={handleLotteryLevelPressed} >
              LotteryLevel
              </Button>
              {lotteryLevel}
            </Row>
            {/* Winer */}
            <Row>
              {/* <Text>Input</Text> */}
              <Input
              id="LotteryID"
              placeholder="Input LotteryID"
              scale="sm"
              value={lotteryID}
              onChange={inParamLotteryIDChange}
              style={{ position: 'relative', zIndex: 0, paddingRight: '8px', maxWidth: '150px', textAlign: 'right'}}
              />
              <Button disabled={pendingTx} id="Winer" scale="sm" onClick={handleWinnerPressed} >
              Winer
              </Button>
              {winner}
            </Row>
            {/* MemberInfo */}
            <Row>
              {/* <Text>Input</Text> */}
              <Input
              id="LotteryID"
              placeholder="Input LotteryID"
              scale="sm"
              value={lotteryID}
              onChange={inParamLotteryIDChange}
              style={{ position: 'relative', zIndex: 0, paddingRight: '8px', maxWidth: '150px', textAlign: 'right'}}
              />
              <Button disabled={pendingTx} id="MemberInfo" scale="sm" onClick={handleMemberInfoPressed} >
              MemberInfo
              </Button>
              {memberInfo}
            </Row>
            {/* LottoInfo */}
            <Row>
              {/* <Text>Input</Text> */}
              <Input
              id="LotteryID"
              placeholder="Input LotteryID"
              scale="sm"
              value={lotteryID}
              onChange={inParamLotteryIDChange}
              style={{ position: 'relative', zIndex: 0, paddingRight: '8px', maxWidth: '150px', textAlign: 'right'}}
              />
              <Button disabled={pendingTx} id="LottoInfo" scale="sm" onClick={handleLottoInfoPressed} >
              LottoInfo
              </Button>
              {lottoInfo}
            </Row>
          </Heading>

          <Heading>
            <Heading scale="lg" color="blue" mb="24px" textAlign="center">
              <br/>
              SetFunctions and Transactions
            </Heading>
            {/* Set Treasury */}
            <Row>
              <Input
              id="NewTreasury"
              placeholder="Input new treasury address"
              value={newTreasury}
              scale="sm"
              onChange={inParamNewTreasuryChange}
              style={{ position: 'relative', zIndex: 10, paddingRight: '8px', maxWidth: '420px', textAlign: 'right'}}
              />
              <Button disabled={pendingTx} id="SetTREASURY" scale="sm" onClick={handleSetTREASURYPressed} >
                SetTREASURY
              </Button>
            </Row>
            {/* Set LotteryCycle */}
            <Row>
              <Input
              id="NewLotterCycle"
              placeholder="Input new lottery cycle value"
              value={newLotteryCycle}
              scale="sm"
              onChange={inParamNewLotteryCycleChange}
              style={{ position: 'relative', zIndex: 10, paddingRight: '8px', maxWidth: '250px', textAlign: 'right'}}
              />
              <Button disabled={pendingTx} id="SetLotteryCycle" scale="sm" onClick={handleSetLotteryCyclePressed} >
                SetLotteryCycle
              </Button>
            </Row>
            {/* Create NewLottery */}
            <Row>
              <Input
              id="CreatNewLotto"
              placeholder="Input new lottery level range:from 0 to 5"
              value={createNewLottoParam}
              scale="sm"
              onChange={inParamCreatNewLottoChange}
              style={{ position: 'relative', zIndex: 10, paddingRight: '8px', maxWidth: '350px', textAlign: 'right'}}
              />
              <Button disabled={pendingTx} id="CreatNewLotto" scale="sm" onClick={handleCreatNewLottoPressed} >
                Create New Lottery
              </Button>
            </Row>
            {/* Buy Ticket */}
            <Row>
              <Input
              id="BuyTicketInputInparam1"
              placeholder="Input lottery ID"
              value={lotteryIDofBuyTicket}
              scale="sm"
              onChange={inParam2BuyTicketChange}
              style={{ position: 'relative', zIndex: 10, paddingRight: '8px', maxWidth: '150px', textAlign: 'right'}}
              />
              <Input
              id="BuyTicketInputInparam2"
              placeholder="Input ticket amount"
              value={ticketAmountOfBuyTicket}
              scale="sm"
              onChange={inParamBuyTicketChange}
              style={{ position: 'relative', zIndex: 10, paddingRight: '8px', maxWidth: '180px', textAlign: 'right'}}
              />
              <Button disabled={pendingTx} id="BuyTicket" scale="sm" onClick={handleBuyTicketPressed} >
                Buy Ticket
              </Button>
            </Row>
            {/* Who is Winner */}
            <Row>
              <Input
              id="WhoIsWinnerInparam"
              placeholder="Input Lottery ID"
              value={lotteryIDOfWhoIsWinner}
              scale="sm"
              onChange={inParamWhoIsWinnerChange}
              style={{ position: 'relative', zIndex: 10, paddingRight: '8px', maxWidth: '150px', textAlign: 'right'}}
              />
              <Button disabled={pendingTx} id="WhoIsWinner" scale="sm" onClick={handleWhoIsWinnerPressed} >
              Who Is Winner
              </Button>
            </Row>
            {/* Winner Get Prize */}
            <Row>
              <Input
              id="WinnerGetPrizeInparam"
              placeholder="Input Lottery ID"
              value={lotteryIDOfWinnerGetPrize}
              scale="sm"
              onChange={inParamWinnerGetPrizeChange}
              style={{ position: 'relative', zIndex: 10, paddingRight: '8px', maxWidth: '150px', textAlign: 'right'}}
              />
              <Button disabled={pendingTx} id="winnerGetPrize" scale="sm" onClick={handleWinnerGetPrizePressed} >
              Get Prize
              </Button>
            </Row>
            {/* Winner Get Prize */}
            <Row>
              <Button disabled={pendingTx} id="endLotteryProject" scale="sm" onClick={handleEndLotteryProjectPressed} >
              EndLotteryProject
              </Button>
            </Row>
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

          <Button disabled={pendingTx} id="buyButton" onClick={handleBuyPressed} >
            BUY TICKET
          </Button> */}

          <Heading id = "status" color='red' mb="16px">
            {status !== "renderStatusString" ? status : renderStatusString()}
          </Heading>
        </Heading>
      </div>
  );
};

export default Lottery;
