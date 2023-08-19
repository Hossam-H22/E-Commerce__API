
import bcryptjs from 'bcryptjs'

export const hash = ({plainText, saltRound = process.env.SALTROUND} = {}) => {
    const hashResult = bcryptjs.hashSync(plainText, parseInt(saltRound));
    return hashResult
}

export const compare = ({plainText, hashValue} = {}) => {
    const match = bcryptjs.compareSync(plainText, hashValue);
    return match
}