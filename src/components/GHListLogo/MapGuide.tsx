import useDragging from 'hooks/useDragging';
import React, { useEffect, useState } from 'react';
import { ModalContent } from './styled';

interface InputProps {
    showMapGuide: any;
}

// eslint-disable-next-line react/display-name
const MapGuide = React.forwardRef<HTMLInputElement, InputProps>(
    ({ showMapGuide }, notUsedRef) => {
        const [shouldRender, setRender] = useState(showMapGuide);
        const [ref, x, y] = useDragging();

        const style = {
            left: x === 0 ? (window.innerWidth / 2) * 0.5 : (x as number),
            top: y === 0 ? (window.innerHeight / 2) * 0.5 : (y as number),
            animation: `${showMapGuide ? 'fadeIn' : 'fadeOut'} 1s`,
        };

        useEffect(() => {
            if (showMapGuide) setRender(true);
        }, [showMapGuide]);

        const onAnimationEnd = () => {
            if (!showMapGuide) setRender(false);
        };

        return (
            shouldRender && (
                <ModalContent
                    id="modalcontent"
                    ref={ref as React.RefObject<HTMLDivElement>}
                    style={style}
                    onAnimationEnd={onAnimationEnd}
                >
                    <span
                        className="modal-cancel"
                        onClick={() => {
                            setRender(false);
                        }}
                        ref={notUsedRef}
                    >
                        ✕
                    </span>
                    <h1>Welcome to Global.health Map!</h1>{' '}
                    <p>
                        These geospatial data visualisations allow you to
                        explore our COVID-19 line-list dataset through a few
                        different views:
                    </p>{' '}
                    <p>
                        <strong>Country View:</strong> Click on a country to see
                        available line-list data in that country, and click
                        “Explore Country Data” to view and download
                        corresponding filtered results of data for that country.
                        You can also use the left-hand navigation to search or
                        select a country. Darker colours indicate more available
                        line-list data. Please see our{' '}
                        <a href="https://global.health/faqs/" title="FAQs">
                            FAQs
                        </a>{' '}
                        and{' '}
                        <a
                            href="https://global.health/acknowledgement/"
                            title="Data Acknowledgments"
                        >
                            Data Acknowledgments
                        </a>{' '}
                        for more info.)
                    </p>{' '}
                    <p>
                        <strong>Regional View:</strong> Click on a circle to see
                        available line-list data in that region, and click
                        “Explore Regional Data” to view and download
                        corresponding filtered results of data for that region.
                        Larger, darker circles indicate more available line-list
                        data. Records that do not include regional metadata are
                        labeled as “Country, Country” (e.g. “India, India”).
                        Please see our{' '}
                        <a href="https://global.health/faqs/" title="FAQs">
                            FAQs
                        </a>{' '}
                        for more info.
                    </p>{' '}
                    <p>
                        <strong>Coverage Map:</strong> This view illustrates
                        available line-list COVID-19 case data in the
                        Global.health database in a given country as a
                        percentage of total cumulative case data as indicated by
                        the{' '}
                        <a
                            href="https://coronavirus.jhu.edu/map.html"
                            title="Johns Hopkins University COVID Resource Center"
                            target="blank"
                            rel="noopener noreferrer"
                        >
                            Johns Hopkins University COVID Resource Center
                        </a>
                        . Darker colours indicate more available line-list data.
                        Totals are updated daily. The availability of
                        publically-reported line-list data varies substantially
                        by country. Please see our{' '}
                        <a href="https://global.health/faqs/" title="FAQs">
                            FAQs
                        </a>{' '}
                        for more info.
                    </p>
                </ModalContent>
            )
        );
    },
);

export default MapGuide;
