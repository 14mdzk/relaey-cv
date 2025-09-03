type TypegraphyProps = {
    children: React.ReactNode;
    className?: string;
}

const H1: React.FC<TypegraphyProps> = ({ children, className}) => {
    return (
        <h1 className={"scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance " + className}>{children}</h1>
    )
}

const H2: React.FC<TypegraphyProps> = ({ children, className}) => {
    return (
        <h2 className={"scroll-m-20 text-center text-3xl font-extrabold tracking-tight text-balance " + className}>{children}</h2>
    )
}

const H3: React.FC<TypegraphyProps> = ({ children, className}) => {
    return (
        <h3 className={"scroll-m-20 text-center text-2xl font-extrabold tracking-tight text-balance " + className}>{children}</h3>
    )
}

const H4: React.FC<TypegraphyProps> = ({ children, className}) => {
    return (
        <h4 className={"scroll-m-20 text-center text-xl font-extrabold tracking-tight text-balance " + className}>{children}</h4>
    )
}

const P: React.FC<TypegraphyProps> = ({ children, className}) => {
    return (
        <p className={"leading-7 [&:not(:first-child)]:mt-2 " + className}>{children}</p>
    )
}

export {
    H1,
    H2,
    H3,
    H4,
    P,
}