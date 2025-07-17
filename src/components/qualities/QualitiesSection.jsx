import QualityCard from "./QualityCard";
import { PiLeafFill } from "react-icons/pi";
import { FaTruckFast } from "react-icons/fa6";
import { FaHandshakeSimple } from "react-icons/fa6";
import { RiVerifiedBadgeFill } from "react-icons/ri";

export default function QualitiesSection() {
  return (
    <section className="w-full py-12">
      <h2 className="text-center text-3xl mt-8 mb-8 font-bold text-gray-800">
        Porquê nos escolher?
      </h2>
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex flex-wrap mb-5 justify-center items-center gap-8 md:gap-14 w-full">
          <QualityCard
            icone={<PiLeafFill color="#1a8f23" size={40} />}
            titulo={
              <span className="text-gray-800 font-semibold">100% Natural</span>
            }
            texto={
              <span className="text-gray-600 text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </span>
            }
          />
          <QualityCard
            icone={<FaTruckFast color="#1a8f23" size={40} />}
            titulo={
              <span className="text-gray-800 font-semibold">
                Entrega Rápida
              </span>
            }
            texto={
              <span className="text-gray-600 text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </span>
            }
          />
          <QualityCard
            icone={<FaHandshakeSimple color="#1a8f23" size={40} />}
            titulo={
              <span className="text-gray-800 font-semibold">Parceria</span>
            }
            texto={
              <span className="text-gray-600 text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </span>
            }
          />
          <QualityCard
            icone={<RiVerifiedBadgeFill color="#1a8f23" size={40} />}
            titulo={
              <span className="text-gray-800 font-semibold">
                Qualidade Garantida
              </span>
            }
            texto={
              <span className="text-gray-600 text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </span>
            }
          />
        </div>
      </div>
    </section>
  );
}
